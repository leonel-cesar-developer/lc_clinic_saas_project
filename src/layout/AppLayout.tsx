import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import { AppHeader } from "../components/Header/AppHeader";
import { useAuth } from "../stores/useAuth";
import { paths } from "../app/router/Paths";

export default function AppLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout(): void {
    navigate(paths.auth.logout);
  }

  function closeSidebar(): void {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppHeader
          user={user}
          notificationsCount={0}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main
          id="main-content"
          className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

