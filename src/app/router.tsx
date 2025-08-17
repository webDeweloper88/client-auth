//src/app/router.tsx
import { App } from "@/app/App";
import { ROUTES } from "@/shared/model/routes";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: ROUTES.HOME,
        lazy: () => import("@/features/home/home.page"),
      },

      {
        path: ROUTES.SESSIONS,
        lazy: () => import("@/features/session-list/session-list.page"),
      },
      {
        path: ROUTES.SESSION,
        lazy: () => import("@/features/Sesion/session.page"),
      },
      {
        path: ROUTES.LOGIN,
        lazy: () => import("@/features/auth/login.page"),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import("@/features/auth/register.page"),
      },
    ],
  },
]);
