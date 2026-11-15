import type { User } from "@prisma/client";
import type { RequestHandler } from "express";
import { prisma } from "../db";
import { AUTH_COOKIE, clearAuthCookie, readToken } from "../lib/auth";

declare module "express-serve-static-core" {
  interface Request {
    /** Текущий пользователь, заполняется в requireAuth */
    user?: User;
  }
}

/**
 * Пускает только вошедших. Берёт пользователя из базы, поэтому удалённый аккаунт
 * и токен, выданный до смены пароля, больше не работают.
 */
export const requireAuth: RequestHandler = async (req, res, next) => {
  const payload = readToken(req.cookies?.[AUTH_COOKIE]);
  const user = payload ? await prisma.user.findUnique({ where: { id: payload.sub } }) : null;
  const changedAt = user?.passwordChangedAt
    ? Math.floor(user.passwordChangedAt.getTime() / 1000)
    : 0;

  if (!payload || !user || payload.iat < changedAt) {
    clearAuthCookie(res);
    res.status(401).json({ error: "Нужно войти в аккаунт" });
    return;
  }
  req.user = user;
  next();
};
