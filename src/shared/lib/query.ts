import type { QueryFunctionContext } from "@tanstack/react-query";
import { api } from "../api/client";
import { ROUTES } from "../model/routes";

// Константы для query keys
export const QUERY_KEYS = {
  USER_PROFILE: ["user", "profile"] as const,
  USER_ACCESS_LOGS: ["user", "access-logs"] as const,
  SESSIONS: ["sessions"] as const,
  ADMIN_USERS: ["admin", "users"] as const,
  ADMIN_SESSIONS: ["admin", "sessions"] as const,
  ADMIN_ACCESS_LOGS: ["admin", "access-logs"] as const,
} as const;

// Тип для query keys
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];

// Кастомный queryFn с обработкой 401 ошибок
export async function queryFn<T>(
  _context: QueryFunctionContext<QueryKey>,
  fetchFn: () => Promise<{ data?: T; error?: unknown }>
): Promise<T> {
  const response = await fetchFn();
  if (response.error && (response.error as Response)?.status === 401) {
    try {
      const refreshResponse = await api.auth.refreshTokens();
      // Если refresh прошел успешно (статус 200), токены обновились через cookies
      if (!refreshResponse.error) {
        // Повторяем исходный запрос
        const retryResponse = await fetchFn();
        if (retryResponse.data) {
          return retryResponse.data;
        }
        throw retryResponse.error || new Error("Retry failed");
      }
    } catch {
      api.setAccessToken(undefined);
      // Редирект на страницу входа
      window.location.href = `${ROUTES.LOGIN}?from=${encodeURIComponent(
        window.location.pathname
      )}`;
    }
  }
  if (response.data) {
    return response.data;
  }
  throw response.error || new Error("Request failed");
}
