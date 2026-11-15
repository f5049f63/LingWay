export type SituationIconKey =
  "airport" | "plane" | "hotel" | "cafe" | "city" | "transport" | "shop" | "emergency";

export interface Situation {
  slug: string;
  title: string;
  description: string;
  icon: SituationIconKey;
  /** Пример фразы для карточки */
  phrase: string;
  phraseRu: string;
}

// Список для лендинга. Полный контент ситуаций хранится в базе данных.
export const situations: Situation[] = [
  {
    slug: "airport",
    title: "Аэропорт",
    description: "Регистрация, багаж, паспортный контроль, поиск выхода на посадку",
    icon: "airport",
    phrase: "Where is gate twelve?",
    phraseRu: "Где выход на посадку номер двенадцать?",
  },
  {
    slug: "plane",
    title: "Самолёт",
    description: "Поиск места, просьбы бортпроводнику, напитки и объявления",
    icon: "plane",
    phrase: "Could I have some water, please?",
    phraseRu: "Можно воды, пожалуйста?",
  },
  {
    slug: "hotel",
    title: "Отель",
    description: "Бронирование, заселение, вопросы по номеру, выезд",
    icon: "hotel",
    phrase: "I have a reservation under Ivanova.",
    phraseRu: "У меня бронь на фамилию Иванова.",
  },
  {
    slug: "cafe",
    title: "Кафе и ресторан",
    description: "Заказ, уточнение блюд, просьба счёта",
    icon: "cafe",
    phrase: "Could we have the bill, please?",
    phraseRu: "Принесите счёт, пожалуйста.",
  },
  {
    slug: "city",
    title: "Город",
    description: "Как пройти, вопросы прохожим, достопримечательности",
    icon: "city",
    phrase: "How do I get to the old town?",
    phraseRu: "Как пройти в старый город?",
  },
  {
    slug: "transport",
    title: "Транспорт",
    description: "Билеты, расписание, такси, пересадки",
    icon: "transport",
    phrase: "One ticket to the centre, please.",
    phraseRu: "Один билет до центра, пожалуйста.",
  },
  {
    slug: "shop",
    title: "Магазин",
    description: "Размер, цена, оплата, возврат",
    icon: "shop",
    phrase: "Do you have this in a smaller size?",
    phraseRu: "Есть это размером поменьше?",
  },
  {
    slug: "emergency",
    title: "Экстренные ситуации",
    description: "Потеря документов, вызов помощи, врач, полиция",
    icon: "emergency",
    phrase: "I need a doctor. Please call an ambulance.",
    phraseRu: "Мне нужен врач. Вызовите скорую.",
  },
];
