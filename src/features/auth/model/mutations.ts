import {
  api,
  type LoginDto,
  type LoginResponse,
  type RegisterDto,
  type ResendVerificationDto,
  type SetPasswordDto,
} from "@/shared/api/client"; // Импорт через public API
import { parseApiError, type ApiError } from "@/shared/lib/error"; // Импорт через public API
import { QUERY_KEYS } from "@/shared/lib/query"; // Импорт через public API
import { toastService } from "@/shared/lib/toast"; // Импорт через public API
import { ROUTES } from "@/shared/model/routes"; // Импорт через public API
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthMutationOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  redirectTo?: string;
}

function useAuthMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  successMessage: string,
  queryClient: ReturnType<typeof useQueryClient>,
  navigate: ReturnType<typeof useNavigate>,
  location: ReturnType<typeof useLocation>,
  options?: AuthMutationOptions
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      toastService.success(successMessage);
      if (options?.onSuccess) {
        options.onSuccess();
      } else {
        const redirectPath =
          (location.state as { from?: string } | undefined)?.from ||
          options?.redirectTo ||
          ROUTES.PROFILE;
        navigate(redirectPath, { replace: true });
      }
    },
    onError: async (error, variables) => {
      const apiError = parseApiError(error);
      if (apiError.status === 401) {
        try {
          await api.auth.refreshTokens();
          // Повторяем запрос после успешного рефреша, если есть переменные
          if (typeof variables !== "undefined") {
            await mutationFn(variables as TVariables);
          }
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
          toastService.success(successMessage);
          const redirectPath =
            (location.state as { from?: string } | undefined)?.from ||
            options?.redirectTo ||
            ROUTES.PROFILE;
          navigate(redirectPath, { replace: true });
          return;
        } catch {
          api.setAccessToken(undefined);
          navigate(
            `${ROUTES.LOGIN}?from=${encodeURIComponent(location.pathname)}`,
            { replace: true }
          );
          return;
        }
      }
      toastService.error(apiError.message);
      options?.onError?.(apiError);
    },
  });
}

export function useLoginMutation(options?: AuthMutationOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useAuthMutation<LoginResponse, LoginDto>(
    async (data: LoginDto) => {
      const response = await api.auth.login({ ...data, client: "web" });
      if (response.error) {
        throw response.error;
      }
      if (!response.data) {
        throw new Error("Empty response from /auth/login");
      }
      const login = response.data as unknown as LoginResponse;
      api.setAccessToken(login.access_token);
      // Persist token for future sessions
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", login.access_token);
      }
      return login;
    },
    "Добро пожаловать! Вход выполнен успешно",
    queryClient,
    navigate,
    location,
    options
  );
}

export function useRegisterMutation(options?: AuthMutationOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useAuthMutation<unknown, RegisterDto>(
    async (data: RegisterDto) => {
      const response = await api.auth.register(data);
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
    "Регистрация успешна! Проверьте email для верификации",
    queryClient,
    navigate,
    location,
    options
  );
}

export function useLogoutMutation(options?: AuthMutationOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useAuthMutation<unknown, void>(
    async () => {
      const raw = await api.auth.logout();
      const response = raw as { data?: unknown; error?: unknown };
      if (response.error) {
        throw response.error as unknown as ApiError;
      }
      api.setAccessToken(undefined);
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      return response.data;
    },
    "Вы вышли из системы",
    queryClient,
    navigate,
    location,
    options
  );
}

export function useResendVerificationMutation(options?: AuthMutationOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useAuthMutation<unknown, ResendVerificationDto>(
    async (data: ResendVerificationDto) => {
      const response = await api.auth.resendVerification(data);
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
    "Письмо для верификации отправлено",
    queryClient,
    navigate,
    location,
    options
  );
}

export function useSetPasswordMutation(options?: AuthMutationOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useAuthMutation<unknown, SetPasswordDto>(
    async (data: SetPasswordDto) => {
      const raw = await api.auth.setPassword(data);
      const response = raw as { data?: unknown; error?: unknown };
      if (response.error) {
        throw response.error as unknown as ApiError;
      }
      return response.data;
    },
    "Пароль успешно установлен",
    queryClient,
    navigate,
    location,
    options
  );
}
