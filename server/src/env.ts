import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL не задан (см. server/.env.example)"),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z
    .string()
    .min(16, "JWT_SECRET не задан или короче 16 символов (см. server/.env.example)"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  // Адрес сайта для ссылок в письмах (сброс пароля)
  APP_URL: z.string().default("http://localhost:5173/LingWay"),
  // Почта. Если SMTP_HOST не задан, письма не отправляются, а ссылка пишется в консоль сервера
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default("LingWay <no-reply@lingway.local>"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Ошибка настроек окружения:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
