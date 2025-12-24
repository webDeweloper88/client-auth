import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  SESSIONS: "/sessions",
  SESSION: "/sessions/:sessionId",
} as const;

export type PathParams = {
  [ROUTES.SESSION]: {
    sessionId: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
