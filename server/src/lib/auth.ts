import type { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

const COOKIE_NAME = "token";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type TokenPayload = { sub: string; role: "USER" | "ADMIN"; iat: number };

// На продакшене клиент (GitHub Pages) и сервер (Render) на разных доменах:
// для cookie нужны sameSite=none и secure. Локально хватает lax.
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: MAX_AGE_MS,
  path: "/",
};

export function setAuthCookie(res: Response, payload: Omit<TokenPayload, "iat">) {
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
}

export function readToken(token: unknown): TokenPayload | null {
  if (typeof token !== "string") return null;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === "object" && typeof decoded.sub === "string") {
      return {
        sub: decoded.sub,
        role: decoded.role === "ADMIN" ? "ADMIN" : "USER",
        iat: typeof decoded.iat === "number" ? decoded.iat : 0,
      };
    }
  } catch {
    // просроченный или подделанный токен считаем отсутствием входа
  }
  return null;
}

export const AUTH_COOKIE = COOKIE_NAME;
