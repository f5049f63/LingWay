import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Пока проверяем вход, показываем пустой каркас, чтобы страница не мигала */
function Checking() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12" aria-busy="true">
      <div className="h-8 w-48 rounded-lg bg-surface-subtle" />
      <div className="mt-6 h-48 rounded-3xl bg-surface-subtle" />
    </div>
  );
}

/** Только для вошедших. Гостя отправляет на вход и после входа возвращает сюда. */
export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (user === undefined) return <Checking />;
  if (user === null) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}

/** Только для гостей: вошедшего отправляет в приложение (или туда, откуда его привели на вход) */
export function GuestOnly() {
  const { user } = useAuth();
  const location = useLocation();
  if (user === undefined) return <Checking />;
  if (user) {
    const from = (location.state as { from?: string } | null)?.from ?? "/learn";
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}
