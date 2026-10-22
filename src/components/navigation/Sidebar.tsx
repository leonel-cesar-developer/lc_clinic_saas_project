
import { useEffect, useRef } from "react";

import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import { paths } from "../../app/router/Paths";

interface NavigationItem {
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    description: "Visão geral",
    path: paths.app.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Marcações",
    description: "Agenda clínica",
    path: paths.app.appointments,
    icon: CalendarDays,
  },
  {
    label: "Pacientes",
    description: "Gestão de pacientes",
    path: paths.app.patients,
    icon: Users,
  },
  {
    label: "Médicos",
    description: "Equipa médica",
    path: paths.app.doctors,
    icon: Stethoscope,
  },
  {
    label: "Definições",
    description: "Configurações",
    path: paths.app.settings,
    icon: Settings,
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const location = useLocation();

  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Fecha o menu móvel quando a rota muda.
  useEffect(() => {
    onCloseRef.current();
  }, [location.pathname]);

  // Acessibilidade e controlo do menu móvel.
  useEffect(() => {
    if (!isOpen) return;

    const mediaQuery = window.matchMedia(
      "(min-width: 1024px)",
    );

    if (mediaQuery.matches) return;

    const previousOverflow =
      document.body.style.overflow;

    const previouslyFocused =
      document.activeElement;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const sidebar = sidebarRef.current;

      if (!sidebar) return;

      const focusableElements =
        sidebar.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );

      const first = focusableElements[0];
      const last =
        focusableElements[
          focusableElements.length - 1
        ];

      if (!first || !last) return;

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleDesktopTransition(
      event: MediaQueryListEvent,
    ) {
      if (event.matches) {
        onCloseRef.current();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    mediaQuery.addEventListener(
      "change",
      handleDesktopTransition,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      mediaQuery.removeEventListener(
        "change",
        handleDesktopTransition,
      );

      if (
        previouslyFocused instanceof HTMLElement
      ) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* MOBILE BACKDROP */}
      {isOpen && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Fechar navegação"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        id="clinic-sidebar"
        aria-label="Menu lateral da clínica"
        className={[
          "fixed inset-y-0 left-0 z-50",
          "flex h-dvh w-64 max-w-[85vw] flex-col",
          "border-r border-[#24435F]",
          "bg-[#102B43] text-white",
          "shadow-2xl",
          "transition-transform duration-200 ease-out",
          "lg:sticky lg:top-0 lg:z-30",
          "lg:h-screen lg:w-60",
          "lg:max-w-none lg:translate-x-0",
          "lg:shadow-none",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        {/* BRAND */}
        <div className="flex min-h-20 items-center justify-between gap-2 border-b border-white/10 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
              <Stethoscope
                className="h-6 w-6 text-blue-100"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[15px] font-extrabold tracking-tight text-white">
                Clínica Saúde+
              </p>

              <p className="mt-0.5 truncate text-[10px] font-medium text-slate-300">
                Gestão clínica inteligente
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:hidden"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Menu principal
          </p>

          <nav
            aria-label="Navegação principal"
            className="space-y-1.5"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3",
                      "rounded-xl px-3 py-3",
                      "transition-all duration-150",
                      "focus-visible:outline-none",
                      "focus-visible:ring-2",
                      "focus-visible:ring-blue-400",
                      "focus-visible:ring-offset-2",
                      "focus-visible:ring-offset-[#102B43]",
                      isActive
                        ? "bg-[#1266C3] text-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
                        : "text-slate-300 hover:bg-white/10 hover:text-white",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* ICON */}
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0",
                          "items-center justify-center",
                          "rounded-lg transition-colors",
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-slate-300 group-hover:text-white",
                        ].join(" ")}
                      >
                        <Icon
                          className="h-[19px] w-[19px]"
                          strokeWidth={1.9}
                          aria-hidden="true"
                        />
                      </div>

                      {/* LABEL */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold">
                          {item.label}
                        </p>
                      </div>

                      {/* ACTIVE INDICATOR */}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-white"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* SECONDARY INFORMATION */}
          <div className="mt-8 px-3">
            <div className="h-px bg-white/10" />

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Plataforma
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Sistema integrado de gestão clínica
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15">
              <Stethoscope
                className="h-4 w-4 text-blue-300"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-100">
                LC ClinicSaaS
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                Gestão inteligente
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
