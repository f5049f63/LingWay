import { Prisma } from "@prisma/client";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { clearAuthCookie, setAuthCookie } from "../lib/auth";
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

