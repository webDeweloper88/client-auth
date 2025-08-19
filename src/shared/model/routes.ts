import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  OAUTH_CALLBACK: "/oauth/callback",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/profile/change-password",
  TWO_FA: "/profile/2fa",
  ACCESS_LOGS: "/access-logs",
  SESSIONS: "/sessions",
  SESSION: "/sessions/:sessionId",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER: "/admin/users/:userId",
  ADMIN_SESSIONS: "/admin/sessions",
  ADMIN_ACCESS_LOGS: "/admin/access-logs",
} as const;

export type PathParams = {
  [ROUTES.SESSION]: { sessionId: string };
  [ROUTES.ADMIN_USER]: { userId: string };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
