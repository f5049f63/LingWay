import { Prisma } from "@prisma/client";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { prisma } from "../db";
import { clearAuthCookie, setAuthCookie } from "../lib/auth";
import { onboardingSchema } from "../lib/onboarding";
import { checkPassword, hashPassword, toPublic } from "../lib/user";
import {
  currentPasswordSchema,
  emailSchema,
  nameSchema,
  newPasswordSchema,
  validationError,
} from "../lib/validation";
import { requireAuth } from "../middleware/auth";

export const accountRouter = Router();
accountRouter.use(requireAuth);

// Действия, где вводится пароль: ограничиваем неудачные попытки, чтобы пароль нельзя было подбирать
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user!.id,
  message: { error: "Слишком много попыток. Попробуйте через 15 минут" },
});

const wrongPassword = (field: string) => ({
  error: "Неверный пароль",
  fields: { [field]: "Неверный пароль" },
});

accountRouter.patch("/profile", async (req, res) => {
  const parsed = z.object({ name: nameSchema }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name: parsed.data.name },
  });
  res.json({ user: toPublic(user) });
});

// Ответы онбординга. Можно отправлять повторно: так пользователь меняет маршрут в настройках
accountRouter.put("/onboarding", async (req, res) => {
  const parsed = onboardingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { purpose, destination, level } = parsed.data;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { tripPurpose: purpose, destination, level, onboardedAt: new Date() },
  });
  res.json({ user: toPublic(user) });
});

// Пропуск онбординга: ответы не сохраняем, но больше его не показываем после входа
accountRouter.post("/onboarding/skip", async (req, res) => {
  const user =
    req.user!.onboardedAt === null
      ? await prisma.user.update({ where: { id: req.user!.id }, data: { onboardedAt: new Date() } })
      : req.user!;
  res.json({ user: toPublic(user) });
});

accountRouter.post("/email", passwordLimiter, async (req, res) => {
  const parsed = z
    .object({ email: emailSchema, password: currentPasswordSchema })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { email, password } = parsed.data;

  if (!(await checkPassword(password, req.user!))) {
    res.status(403).json(wrongPassword("password"));
    return;
  }
  if (email === req.user!.email) {
    res.status(400).json({ error: "Это уже ваш email", fields: { email: "Это уже ваш email" } });
    return;
  }

  try {
    const user = await prisma.user.update({ where: { id: req.user!.id }, data: { email } });
    res.json({ user: toPublic(user) });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      res.status(409).json({
        error: "Этот email уже зарегистрирован",
        fields: { email: "Этот email уже занят" },
      });
      return;
    }
    throw e;
  }
});

accountRouter.post("/password", passwordLimiter, async (req, res) => {
  const parsed = z
    .object({ currentPassword: currentPasswordSchema, newPassword: newPasswordSchema })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  const { currentPassword, newPassword } = parsed.data;

  if (!(await checkPassword(currentPassword, req.user!))) {
    res.status(403).json(wrongPassword("currentPassword"));
    return;
  }
  if (currentPassword === newPassword) {
    res.status(400).json({
      error: "Новый пароль совпадает с текущим",
      fields: { newPassword: "Новый пароль должен отличаться от текущего" },
    });
    return;
  }

  // Смена пароля завершает все остальные сессии; текущую продлеваем новым токеном
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { passwordHash: await hashPassword(newPassword), passwordChangedAt: new Date() },
  });
  setAuthCookie(res, { sub: user.id, role: user.role });
  res.json({ user: toPublic(user) });
});

accountRouter.delete("/", passwordLimiter, async (req, res) => {
  const parsed = z.object({ password: currentPasswordSchema }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(validationError(parsed.error));
    return;
  }
  if (!(await checkPassword(parsed.data.password, req.user!))) {
    res.status(403).json(wrongPassword("password"));
    return;
  }
  await prisma.user.delete({ where: { id: req.user!.id } });
  clearAuthCookie(res);
  res.json({ ok: true });
});
