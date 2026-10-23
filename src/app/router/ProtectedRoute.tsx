import {Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../stores/useAuth";
import { paths } from "./Paths";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={paths.auth.login}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}