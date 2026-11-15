import type { Purpose } from "./onboarding";
import { situations, type Situation } from "./situations";

// Порядок ситуаций под цель поездки: сначала то, что понадобится раньше всего.
// Экстренные ситуации всегда в конце: их учат про запас.
const orders: Record<Purpose, string[]> = {
  tourism: ["airport", "plane", "hotel", "city", "transport", "cafe", "shop", "emergency"],
  business: ["airport", "plane", "hotel", "transport", "cafe", "city", "shop", "emergency"],
  study: ["airport", "transport", "city", "shop", "cafe", "hotel", "plane", "emergency"],
  relocation: ["airport", "hotel", "transport", "shop", "city", "cafe", "plane", "emergency"],
};

/** Ситуации в порядке маршрута. Без цели (онбординг пропущен) отдаёт общий порядок. */
export function routeFor(purpose: string | null): Situation[] {
  const order = purpose && purpose in orders ? orders[purpose as Purpose] : null;
  if (!order) return situations;
  return order.flatMap((slug) => situations.filter((s) => s.slug === slug));
}
