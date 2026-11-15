const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Ошибка ответа сервера: статус, текст и тексты по полям формы (если сервер их прислал) */
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/** Запрос к серверной части. Бросает ApiError, если сервер ответил не 2xx. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(
      0,
      "Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз",
    );
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      typeof data?.error === "string" ? data.error : `Ошибка ${res.status}`,
      data?.fields ?? {},
    );
  }
  return data as T;
}
