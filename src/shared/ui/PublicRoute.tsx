import { useAuthStatus } from "@/shared/lib/auth"; // Импорт через public API
import { ROUTES } from "@/shared/model/routes"; // Импорт через public API
import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
  const { data, isLoading } = useAuthStatus();

  if (isLoading) {
    return <div>Loading...</div>; // Спиннер
  }

  if (data) {
    // Если пользователь аутентифицирован, перенаправляем на профиль
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  return <Outlet />;
}
