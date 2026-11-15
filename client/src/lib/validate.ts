const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailError(email: string): string | undefined {
  if (!email.trim()) return "Введите email";
  if (!EMAIL_RE.test(email.trim())) return "Введите корректный email";
}

export function newPasswordError(password: string): string | undefined {
  if (!password) return "Введите пароль";
  if (password.length < 8) return "Пароль не короче 8 символов";
  if (password.length > 72) return "Пароль не длиннее 72 символов";
}

export function nameError(name: string): string | undefined {
  if (!name.trim()) return "Введите имя";
  if (name.trim().length > 50) return "Имя не длиннее 50 символов";
}

export function confirmError(password: string, confirm: string): string | undefined {
  if (!confirm) return "Повторите пароль";
  if (password !== confirm) return "Пароли не совпадают";
}

/** true, если в объекте ошибок есть хотя бы одно значение */
export const hasErrors = (errors: object) => Object.values(errors).some(Boolean);
