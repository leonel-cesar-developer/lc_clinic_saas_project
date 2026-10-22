
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { paths } from "../../app/router/Paths";
import { useAuth } from "../../stores/auth.store";

interface LocationState {
  from?: string;
}

const LOGO_SRC = "/images/lc-clinic-logo.png";

const RECEPTION_IMAGE = "/images/clinic-reception.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@clinic.pt");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState = location.state as LocationState | null;

  const redirectPath =
    locationState?.from ?? paths.app.dashboard;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) return;

    try {
      setError("");
      setIsSubmitting(true);

      await login({
        email: email.trim(),
        password,
      });

      navigate(redirectPath, {
        replace: true,
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível iniciar sessão.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#F3F7FB] px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:overflow-hidden lg:px-8 lg:py-5">
      <div className="mx-auto grid w-full max-w-[1320px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_-32px_rgba(15,47,89,0.25)] lg:h-full lg:max-h-[calc(100dvh-40px)] lg:grid-cols-[47%_53%]">
        {/* LEFT PANEL */}
        <section className="flex min-w-0 flex-col px-6 py-8 sm:px-12 sm:py-12 lg:px-14 xl:px-20">
          {/* BRAND */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
              <img
                src={LOGO_SRC}
                alt="LC Clinic SaaS"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-xl font-extrabold tracking-tight text-[#092B55]">
                LC Clinic
                <span className="text-[#0873D7]">SaaS</span>
              </p>

              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
                Cuidamos de si, sempre
              </p>
            </div>
          </div>

          {/* LOGIN CONTENT */}
          <div className="flex min-h-0 flex-1 flex-col justify-center py-8 lg:py-6">
            <div className="mb-9">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <ShieldCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Área de acesso reservado
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#102A43] sm:text-[38px]">
                Bem-vindo(a)
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Aceda à sua conta para continuar a gerir
                a sua clínica com segurança.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="seuemail@clinica.pt"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    disabled={isSubmitting}
                    className="h-13 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0873D7] focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Palavra-passe
                </label>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Introduza a sua palavra-passe"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    disabled={isSubmitting}
                    className="h-13 w-full rounded-xl border border-slate-200 bg-[#F8FAFD] pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#0873D7] focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar palavra-passe"
                        : "Mostrar palavra-passe"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-[19px] w-[19px]"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye
                        className="h-[19px] w-[19px]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0866D9] px-5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(8,102,217,0.7)] transition hover:bg-[#0758BC] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                    A iniciar sessão...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* SECURITY NOTE */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              />

              <p className="text-xs leading-5 text-slate-500">
                Acesso reservado a utilizadores autorizados
                da plataforma LC ClinicSaaS.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="border-t border-slate-100 pt-5">
            <p className="text-center text-xs text-slate-400">
              © {new Date().getFullYear()} LC ClinicSaaS.
              Todos os direitos reservados.
            </p>
          </footer>
        </section>

        {/* RIGHT PANEL */}
        <aside className="relative hidden min-h-0 overflow-hidden bg-[#0C335B] lg:block">
          <img
            src={RECEPTION_IMAGE}
            alt="Receção moderna de uma clínica"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* IMAGE GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061C35]/95 via-[#092F56]/25 to-transparent" />

          {/* TOP BADGE */}
          <div className="absolute left-10 top-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
            <HeartPulse
              className="h-4 w-4"
              aria-hidden="true"
            />
            Tecnologia para cuidar melhor
          </div>

          {/* IMAGE CONTENT */}
          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
            <div className="mb-6 h-1 w-14 rounded-full bg-cyan-400" />

            <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight text-white xl:text-[38px]">
              Tecnologia ao serviço
              <br />
              da sua saúde.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-blue-50/90">
              Gestão clínica simples, moderna e eficiente.
              Mais tempo para cuidar de quem realmente importa.
            </p>

            <div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <HeartPulse
                  className="h-5 w-5 text-cyan-200"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  LC ClinicSaaS
                </p>
                <p className="mt-0.5 text-xs text-blue-100/80">
                  Gestão Clínica Inteligente
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
