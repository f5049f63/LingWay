import { Link } from "react-router-dom";

interface Props {
  title: string;
  description?: string;
}

/** Заглушка для страниц, которые ещё не сделаны. Замени её настоящей страницей. */
export default function ComingSoon({ title, description }: Props) {
  return (
    <section className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3">{description ?? "Эта страница в разработке."}</p>
      <Link to="/" className="mt-6 inline-block underline">
        На главную
      </Link>
    </section>
  );
}
