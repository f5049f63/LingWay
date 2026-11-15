import type { RequestHandler } from "express";
import { AUTH_COOKIE, readToken, type TokenPayload } from "../lib/auth";

declare module "express-serve-static-core" {
  interface Request {
    auth?: TokenPayload;
  }
}

/** Пускает только вошедших пользователей, кладёт данные токена в req.auth */
export const requireAuth: RequestHandler = (req, res, next) => {
  const payload = readToken(req.cookies?.[AUTH_COOKIE]);
  if (!payload) {
    res.status(401).json({ error: "Нужно войти в аккаунт" });
    return;
  }
  req.auth = payload;
  next();
};
