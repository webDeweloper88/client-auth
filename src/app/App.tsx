import AppHeader from "@/features/header";
import { Outlet, useLocation } from "react-router-dom";

export function App() {
  const location = useLocation();

  const isAuth =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <div>
      {!isAuth && <AppHeader />}
      <Outlet />
    </div>
  );
}
