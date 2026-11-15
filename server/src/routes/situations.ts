import { Router } from "express";
import { prisma } from "../db";

export const situationsRouter = Router();

// Список ситуаций (пример чтения из базы)
situationsRouter.get("/", async (_req, res) => {
  const situations = await prisma.situation.findMany({ orderBy: { order: "asc" } });
  res.json(situations);
});
