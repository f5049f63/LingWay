import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-3xl font-bold">Такой страницы нет</h1>
      <Link to="/" className="mt-6 inline-block underline">
        На главную
      </Link>
    </section>
  );
}
