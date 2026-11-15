import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Не найдено" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Сломанный JSON в теле запроса
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "Некорректный запрос" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
};
