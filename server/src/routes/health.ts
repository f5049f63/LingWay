import { Router } from "express";
import { prisma } from "../db";

export const healthRouter = Router();

// Проверка, что сервер запущен
healthRouter.get("/", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Проверка подключения к базе данных
healthRouter.get("/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok", database: "connected" });
});
