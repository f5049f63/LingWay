import { z } from "zod";

// Допустимые ответы онбординга. Если меняешь список, обнови такой же в client/src/data/onboarding.ts
export const PURPOSES = ["tourism", "business", "study", "relocation"] as const;
export const DESTINATIONS = [
  "usa",
  "uk",
  "canada",
  "australia",
  "ireland",
  "other",
  "undecided",
] as const;
export const LEVELS = ["A1", "A2", "B1", "B2"] as const;

export const onboardingSchema = z.object({
  purpose: z.enum(PURPOSES, { error: "Выберите цель поездки" }),
  destination: z.enum(DESTINATIONS, { error: "Выберите страну" }),
  level: z.enum(LEVELS, { error: "Выберите уровень" }),
});
