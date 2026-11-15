import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const situations = [
  {
    slug: "airport",
    title: "Аэропорт",
    description: "Регистрация, багаж, паспортный контроль, поиск выхода на посадку",
    icon: "🛫",
  },
  {
    slug: "plane",
    title: "Самолёт",
    description: "Поиск места, просьбы бортпроводнику, напитки и объявления",
    icon: "✈️",
  },
  {
    slug: "hotel",
    title: "Отель",
    description: "Бронирование, заселение, вопросы по номеру, выезд",
    icon: "🏨",
  },
  {
    slug: "cafe",
    title: "Кафе и ресторан",
    description: "Заказ, уточнение блюд, просьба счёта",
    icon: "🍽️",
  },
  {
    slug: "city",
    title: "Город",
    description: "Как пройти, вопросы прохожим, достопримечательности",
    icon: "🗺️",
  },
  {
    slug: "transport",
    title: "Транспорт",
    description: "Билеты, расписание, такси, пересадки",
    icon: "🚆",
  },
  { slug: "shop", title: "Магазин", description: "Размер, цена, оплата, возврат", icon: "🛍️" },
  {
    slug: "emergency",
    title: "Экстренные ситуации",
    description: "Потеря документов, вызов помощи, врач, полиция",
    icon: "🆘",
  },
];

// Можно запускать повторно: записи обновляются, дублей не будет
async function main() {
  for (const [index, s] of situations.entries()) {
    await prisma.situation.upsert({
      where: { slug: s.slug },
      update: { ...s, order: index + 1 },
      create: { ...s, order: index + 1 },
    });
  }
  console.log(`Ситуаций в базе: ${situations.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
