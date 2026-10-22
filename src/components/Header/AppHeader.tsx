
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Stethoscope,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "../../app/router/Paths";
import type { PublicUser } from "../../types/user.types";

interface AppHeaderProps {
  user: PublicUser | null;
  notificationsCount?: number;
  onLogout: () => void;
  onMenuClick: () => void;
}

export function AppHeader({
  user,
  notificationsCount = 0,
  onLogout,
  onMenuClick,
}: AppHeaderProps) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  function handleLogout(): void {
    setMenuOpen(false);
    onLogout();
  }

  function handleSettings(): void {
    setMenuOpen(false);
    navigate(paths.app.settings);
  }

  const initials = getInitials(user?.name);
  const roleLabel = getRoleLabel(user?.role);

  return (
    <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
      {/* LEFT: BRAND */}
      <div className="flex min-w-0 items-center gap-3">
        {/* MOBILE SIDEBAR BUTTON */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu de navegação"
          aria-controls="clinic-sidebar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
        >
          <Menu
            className="h-5 w-5"
            aria-hidden="true"
          />
        </button>

        {/* BRAND TEXT */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Stethoscope
              className="hidden h-5 w-5 shrink-0 text-blue-600 sm:block"
              strokeWidth={2}
              aria-hidden="true"
            />

            <p className="truncate text-base font-extrabold tracking-tight text-[#0B2545] sm:text-xl">
              LC-
              <span className="text-blue-600">
                ClinicSaaS
              </span>
            </p>
          </div>

          <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:text-[11px]">
            Gestão inteligente
          </p>
        </div>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* SEARCH */}
        <button
          type="button"
          aria-label="Pesquisar"
          title="Pesquisar"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:flex"
        >
          <Search
            className="h-5 w-5"
            aria-hidden="true"
          />
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          aria-label={
            notificationsCount > 0
              ? `${notificationsCount} notificações`
              : "Notificações"
          }
          title="Notificações"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Bell
            className="h-5 w-5"
            aria-hidden="true"
          />

          {notificationsCount > 0 && (
            <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {notificationsCount > 9
                ? "9+"
                : notificationsCount}
            </span>
          )}
        </button>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* USER MENU */}
        <div
          ref={menuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Abrir menu do utilizador"
            className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {/* AVATAR */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>

            {/* USER DETAILS */}
            <div className="hidden max-w-44 text-left lg:block">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name ?? "Utilizador"}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user?.email ?? roleLabel}
              </p>
            </div>

            <ChevronDown
              aria-hidden="true"
              className={`hidden h-4 w-4 text-slate-400 transition-transform lg:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN */}
          {menuOpen && (
            <div
              role="menu"
              aria-label="Menu do utilizador"
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            >
              {/* USER SUMMARY */}
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-xs font-bold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.name ?? "Utilizador"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {user?.email ?? "Sem email"}
                    </p>
                  </div>
                </div>

                <span className="mt-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {roleLabel}
                </span>
              </div>

              {/* SETTINGS */}
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSettings}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings
                    className="h-4 w-4 text-slate-400"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="font-medium">
                      Definições
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Preferências da aplicação
                    </p>
                  </div>
                </button>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  <div>
                    <p>Terminar sessão</p>

                    <p className="mt-0.5 text-xs font-normal text-red-400">
                      Sair da aplicação
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getInitials(name?: string): string {
  if (!name?.trim()) {
    return "U";
  }

  const names = name.trim().split(/\s+/);

  if (names.length === 1) {
    return names[0].slice(0, 2).toUpperCase();
  }

  return `${names[0][0]}${
    names[names.length - 1][0]
  }`.toUpperCase();
}

function getRoleLabel(role?: string): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";

    case "DOCTOR":
      return "Médico";

    case "PATIENT":
      return "Paciente";

    default:
      return "Utilizador";
  }
}
