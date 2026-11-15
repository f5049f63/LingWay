const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/** Запрос к серверной части. Бросает ошибку, если сервер ответил не 2xx. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }
  return (await res.json()) as T;
}
