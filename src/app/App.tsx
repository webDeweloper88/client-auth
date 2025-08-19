import AppHeader from "@/features/header";
import { ToastProvider } from "@/shared/ui/ToastProvider";
import { Outlet, useLocation } from "react-router-dom";

export function App() {
  const location = useLocation();

  const isAuth =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <ToastProvider>
      <div>
        {!isAuth && <AppHeader />}
        <Outlet />
      </div>
    </ToastProvider>
  );
}
