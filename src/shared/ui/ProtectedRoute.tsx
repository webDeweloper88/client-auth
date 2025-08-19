import { useAuthStatus } from "@/shared/lib/auth"; // Импорт через public API
import { ROUTES } from "@/shared/model/routes"; // Импорт через public API
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
}

export function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const { data, isLoading, error } = useAuthStatus();

  if (isLoading) {
    // Неброский плейсхолдер вместо текста "Loading..." чтобы избежать мигания
    return <div style={{ minHeight: 80 }} />;
  }

  if (error || !data) {
    // Если ошибка (например, 401) или нет данных, перенаправляем на login
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (requireAdmin && data.role !== "admin") {
    // Если требуется роль admin, но пользователь не админ, перенаправляем на профиль
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  return <Outlet />;
}
