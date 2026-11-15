import nodemailer from "nodemailer";
import { env } from "../env";

const transport = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

/** Отправляет письмо. Без SMTP (локальная разработка) печатает его в консоль сервера. */
export async function sendMail(to: string, subject: string, text: string) {
  if (!transport) {
    console.log(
      `\n[письмо не отправлено: SMTP не настроен]\nКому: ${to}\nТема: ${subject}\n${text}\n`,
    );
    return;
  }
  await transport.sendMail({ from: env.MAIL_FROM, to, subject, text });
}
