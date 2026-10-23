import {Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../stores/useAuth";
import { paths } from "./Paths";

export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={paths.app.dashboard}
        replace
      />
    );
  }

  return <Outlet />;
}