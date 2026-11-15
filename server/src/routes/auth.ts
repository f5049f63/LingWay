import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { clearAuthCookie, setAuthCookie } from "../lib/auth";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

const email = z
  .string({ error: "Введите email" })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Введите корректный email" }));

const registerSchema = z.object({
  name: z
    .string({ error: "Введите имя" })
    .trim()
    .min(1, "Введите имя")
    .max(50, "Имя не длиннее 50 символов"),
  email,
  // bcrypt учитывает только первые 72 байта, поэтому длиннее пароль не принимаем
  password: z
    .string({ error: "Введите пароль" })
    .min(8, "Пароль не короче 8 символов")
    .max(72, "Пароль не длиннее 72 символов"),
});

const loginSchema = z.object({
  email,
  password: z.string({ error: "Введите пароль" }).min(1, "Введите пароль").max(72),
});

type PublicUser = { id: string; email: string; name: string; role: "USER" | "ADMIN" };

const toPublic = (u: PublicUser): PublicUser => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});

/** Ошибки проверки: общий текст и тексты по полям, чтобы показать их у полей формы */
function validationError(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return { error: "Проверьте введённые данные", fields };
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  // считаем только неудачные попытки, чтобы обычный вход не упирался в лимит
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Слишком много попыток входа. Попробуйте через 15 минут" },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Слишком много регистраций с этого адреса. Попробуйте позже" },
});

// Хеш нужен, чтобы время ответа не выдавало, есть ли такой email в базе
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 10);

authRouter.post("/register", registerLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    res
      .status(409)
      .json({ error: "Этот email уже зарегистрирован", fields: { email: "Этот email уже занят" } });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await prisma.user.create({ data: { name, email, passwordHash } });
  } catch (e) {
    // Двое одновременно зарегистрировали один email
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      res.status(409).json({
        error: "Этот email уже зарегистрирован",
        fields: { email: "Этот email уже занят" },
      });
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
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) {
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

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
  if (!user) {
    clearAuthCookie(res);
    res.status(401).json({ error: "Нужно войти в аккаунт" });
    return;
  }
  res.json({ user: toPublic(user) });
});
