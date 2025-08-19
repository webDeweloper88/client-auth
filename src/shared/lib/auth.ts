import type { UserProfileDto } from "@/shared/api/client";
import { api } from "@/shared/api/client"; // Импорт через public API
import { QUERY_KEYS, queryFn } from "@/shared/lib/query"; // Импорт через public API
import { useQuery } from "@tanstack/react-query";

export function useAuthStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: (context) =>
      queryFn<UserProfileDto>(context, () => api.user.getProfile()),
    enabled: !!api.getAccessToken(), // Запрос только если есть токен
  });
}
