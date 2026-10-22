import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-dvh w-full bg-[#F3F7FB]">
      <Outlet />
    </main>
  );
}
