// Ответы онбординга. Значения совпадают с server/src/lib/onboarding.ts: меняешь здесь, меняй и там.

export interface Option<V extends string = string> {
  value: V;
  title: string;
  text?: string;
}

export const purposes = [
  { value: "tourism", title: "Отдых", text: "Путешествие или отпуск" },
  { value: "business", title: "Работа", text: "Командировка, встречи, конференции" },
  { value: "study", title: "Учёба", text: "Обмен, курсы, поступление" },
  { value: "relocation", title: "Переезд", text: "Жизнь в другой стране" },
] as const satisfies readonly Option[];

export const destinations = [
  { value: "usa", title: "США" },
  { value: "uk", title: "Великобритания" },
  { value: "canada", title: "Канада" },
  { value: "australia", title: "Австралия" },
  { value: "ireland", title: "Ирландия" },
  { value: "other", title: "Другая страна" },
  { value: "undecided", title: "Пока не решено" },
] as const satisfies readonly Option[];

export const levels = [
  { value: "A1", title: "Начальный", text: "Знаю несколько слов и фраз" },
  { value: "A2", title: "Базовый", text: "Могу рассказать о себе и задать простой вопрос" },
  {
    value: "B1",
    title: "Средний",
    text: "Объясняюсь в простых ситуациях, но теряюсь в быстрой речи",
  },
  { value: "B2", title: "Уверенный", text: "Говорю свободно, хочу больше практики" },
] as const satisfies readonly Option[];

export type Purpose = (typeof purposes)[number]["value"];
export type Destination = (typeof destinations)[number]["value"];
export type Level = (typeof levels)[number]["value"];

/** Название варианта по значению. Для незнакомого или пустого значения вернёт undefined. */
export function titleOf(list: readonly Option[], value: string | null): string | undefined {
  return list.find((o) => o.value === value)?.title;
}
