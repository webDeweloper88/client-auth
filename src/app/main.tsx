import { QueryProvider } from "@/app/QueryProvider";
import { api } from "@/shared/api/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router";

// Инициализируем access_token из localStorage при старте приложения
try {
  const stored = localStorage.getItem("access_token");
  if (stored) api.setAccessToken(stored);
} catch {
  /* ignore */
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
