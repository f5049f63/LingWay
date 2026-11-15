import { z } from "zod";

export const emailSchema = z
  .string({ error: "Введите email" })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Введите корректный email" }));

export const nameSchema = z
  .string({ error: "Введите имя" })
  .trim()
  .min(1, "Введите имя")
  .max(50, "Имя не длиннее 50 символов");

// bcrypt учитывает только первые 72 байта, поэтому длиннее пароль не принимаем
export const newPasswordSchema = z
  .string({ error: "Введите пароль" })
  .min(8, "Пароль не короче 8 символов")
  .max(72, "Пароль не длиннее 72 символов");

export const currentPasswordSchema = z
  .string({ error: "Введите пароль" })
  .min(1, "Введите пароль")
  .max(72, "Неверный пароль");

/** Ошибки проверки: общий текст и тексты по полям, чтобы показать их у полей формы */
export function validationError(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return { error: "Проверьте введённые данные", fields };
}
