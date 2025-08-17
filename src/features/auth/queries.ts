import { api } from "@/shared/api/client";
import type { UserProfileDto } from "@/shared/api/client";
import { QUERY_KEYS, queryFn } from "@/shared/lib/query";
import { useQuery } from "@tanstack/react-query";

export function useUserProfileQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: (context) =>
      queryFn<UserProfileDto>(context, () => api.user.getProfile()),
    enabled: !!api.getAccessToken(), // Запрос только если есть токен
  });
}
