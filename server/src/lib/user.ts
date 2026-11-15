import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export type PublicUser = Pick<User, "id" | "email" | "name" | "role">;

export const toPublic = (u: User): PublicUser => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});

// Хеш нужен, чтобы время ответа не выдавало, есть ли такой email в базе
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 10);

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

/** Сравнивает пароль с хешем пользователя. Если пользователя нет, всё равно тратит то же время. */
export const checkPassword = (password: string, user: User | null) =>
  bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH).then((ok) => ok && user !== null);
