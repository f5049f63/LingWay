import { Prisma } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { env } from "../env";
import { clearAuthCookie, setAuthCookie } from "../lib/auth";
import { sendMail } from "../lib/mailer";
import { checkPassword, hashPassword, toPublic } from "../lib/user";
import {
  currentPasswordSchema,
  emailSchema,
  nameSchema,
  newPasswordSchema,
  validationError,
} from "../lib/validation";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: newPasswordSchema,
});

const loginSchema = z.object({ email: emailSchema, password: currentPasswordSchema });

const emailTaken = {
  error: "Этот email уже зарегистрирован",
  fields: { email: "Этот email уже занят" },
};

const limiter = (windowMs: number, limit: number, message: string, onlyFailed = false) =>
  rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests: onlyFailed,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: message },
  });

const loginLimiter = limiter(
  15 * 60 * 1000,
  10,
  "Слишком много попыток входа. Попробуйте через 15 минут",
  true,
);
const registerLimiter = limiter(
  60 * 60 * 1000,
  20,
  "Слишком много регистраций с этого адреса. Попробуйте позже",
);
const forgotLimiter = limiter(
  60 * 60 * 1000,
  5,
  "Слишком много запросов на восстановление. Попробуйте через час",
);
const resetLimiter = limiter(15 * 60 * 1000, 10, "Слишком много попыток. Попробуйте позже", true);

authRouter.post("/register", registerLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { name, email, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    res.status(409).json(emailTaken);
    return;
  }

  const passwordHash = await hashPassword(password);
  let user;
  try {
    user = await prisma.user.create({ data: { name, email, passwordHash } });
  } catch (e) {
    // Двое одновременно зарегистрировали один email
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      res.status(409).json(emailTaken);
      return;
    }
    throw e;
  }

  setAuthCookie(res, { sub: user.id, role: user.role });
  res.status(201).json({ user: toPublic(user) });
});

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!(await checkPassword(password, user)) || !user) {
    // Без уточнения, что именно неверно
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }

  setAuthCookie(res, { sub: user.id, role: user.role });
  res.json({ user: toPublic(user) });
});

authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: toPublic(req.user!) });
});

/* ---------------- Восстановление пароля ---------------- */

const RESET_TTL_MS = 60 * 60 * 1000;
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

async function sendResetLink(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const token = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.passwordReset.deleteMany({ where: { userId: user.id, usedAt: null } }),
    prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    }),
  ]);

  const link = `${env.APP_URL}/#/reset/${token}`;
  await sendMail(
    user.email,
    "Восстановление пароля LingWay",
    `Здравствуйте, ${user.name}.\n\nЧтобы задать новый пароль, откройте ссылку (она действует 1 час):\n${link}\n\nЕсли вы не запрашивали восстановление, просто проигнорируйте это письмо.`,
  );
}

// Ответ всегда одинаковый, чтобы нельзя было узнать, какие email зарегистрированы
authRouter.post("/forgot", forgotLimiter, async (req, res) => {
  const parsed = z.object({ email: emailSchema }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  res.json({ ok: true });
  // Письмо отправляем после ответа, чтобы время ответа не выдавало наличие аккаунта
  sendResetLink(parsed.data.email).catch((e) => console.error("Не удалось отправить письмо", e));
});

authRouter.post("/reset", resetLimiter, async (req, res) => {
  const parsed = z
    .object({ token: z.string().min(1).max(200), password: newPasswordSchema })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { token, password } = parsed.data;

  const reset = await prisma.passwordReset.findUnique({ where: { tokenHash: sha256(token) } });
  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    res.status(400).json({ error: "Ссылка недействительна или устарела. Запросите новую" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const now = new Date();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash, passwordChangedAt: now },
    }),
    prisma.passwordReset.deleteMany({ where: { userId: reset.userId } }),
  ]);
  res.json({ ok: true });
});
