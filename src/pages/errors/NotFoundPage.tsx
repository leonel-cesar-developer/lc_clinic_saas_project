import { Link } from "react-router-dom";

import { paths } from "../../app/router/Paths";
import { useAuth } from "../../stores/useAuth";

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  const destination = isAuthenticated
    ? paths.app.dashboard
    : paths.auth.login;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="text-center">
        <p className="text-7xl font-bold text-blue-600">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Página não encontrada
        </h1>

        <p className="mt-2 text-slate-500">
          A página procurada não existe ou foi
          removida.
        </p>

        <Link
          to={destination}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Voltar à aplicação
        </Link>
      </section>
    </main>
  );
}