import { App } from "@/app/App"; // Импорт из app
import { ROUTES } from "@/shared/model/routes"; // Импорт через public API
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute"; // Импорт через public API
import { PublicRoute } from "@/shared/ui/PublicRoute"; // Импорт через public API
import { createBrowserRouter } from "react-router-dom";

const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    lazy: () => import("../features/auth/ui/login.page.tsx"),
  },
  {
    path: ROUTES.REGISTER,
    lazy: () => import("../features/auth/ui/register.page.tsx"),
  },
  {
    path: ROUTES.VERIFY_EMAIL,
    lazy: () => import("../features/auth/ui/verify-email.page.tsx"),
  },
  {
    path: ROUTES.OAUTH_CALLBACK,
    lazy: () => import("../features/auth/ui/oauth-callback.page.tsx"),
  },
];

const protectedRoutes = [
  {
    path: ROUTES.HOME,
    lazy: () => import("../features/home/home.page.tsx"),
  },
  {
    path: ROUTES.PROFILE,
    lazy: () => import("../features/user/user.page.tsx"),
  },
  {
    path: ROUTES.CHANGE_PASSWORD,
    lazy: () => import("../features/user/change-password.page.tsx"),
  },
  {
    path: ROUTES.TWO_FA,
    lazy: () => import("../features/user/two-fa.page.tsx"),
  },
  {
    path: ROUTES.ACCESS_LOGS,
    lazy: () => import("../features/user/access-logs.page.tsx"),
  },
  {
    path: ROUTES.SESSIONS,
    lazy: () => import("../features/session-list/session-list.page.tsx"),
  },
  {
    path: ROUTES.SESSION,
    lazy: () => import("../features/Sesion/session.page.tsx"),
  },
];

const adminRoutes = [
  {
    path: ROUTES.ADMIN_USERS,
    lazy: () => import("../features/admin/users.page.tsx"),
  },
  {
    path: ROUTES.ADMIN_USER,
    lazy: () => import("../features/admin/user.page.tsx"),
  },
  {
    path: ROUTES.ADMIN_SESSIONS,
    lazy: () => import("../features/admin/sessions.page.tsx"),
  },
  {
    path: ROUTES.ADMIN_ACCESS_LOGS,
    lazy: () => import("../features/admin/access-logs.page.tsx"),
  },
];

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <div>Error loading page</div>, // Обработка ошибок загрузки
    children: [
      {
        element: <PublicRoute />,
        children: publicRoutes,
      },
      {
        element: <ProtectedRoute />,
        children: protectedRoutes,
      },
      {
        element: <ProtectedRoute requireAdmin />,
        children: adminRoutes,
      },
      {
        path: "*",
        lazy: () => import("../features/not-found/not-found.page.tsx"),
      },
    ],
  },
]);
