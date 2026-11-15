import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b p-4">
        <Link to="/" className="font-bold">
          LingWay
        </Link>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t p-4 text-sm">© 2026 LingWay. Учебный проект.</footer>
    </div>
  );
}
