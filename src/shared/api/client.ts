import createClient from "openapi-fetch";
import type { components, paths } from "./schema";

// Типы для DTO из OpenAPI схемы
export type UserProfileDto = components["schemas"]["UserProfileDto"];
export type UpdateUserProfileDto =
  components["schemas"]["UpdateUserProfileDto"];
export type ChangePasswordDto = components["schemas"]["ChangePasswordDto"];
export type AccessLogDto = components["schemas"]["AccessLogDto"];
export type QRCodeDto = components["schemas"]["QRCodeDto"];
export type Verify2FADto = components["schemas"]["Verify2FADto"];
export type CreateUserByAdminDto =
  components["schemas"]["CreateUserByAdminDto"];
export type UpdateUserAdminDto = components["schemas"]["UpdateUserAdminDto"];
export type RegisterDto = components["schemas"]["RegisterDto"];
export type ResendVerificationDto =
  components["schemas"]["ResendVerificationDto"];
export type LoginDto = components["schemas"]["LoginDto"];
export type SetPasswordDto = components["schemas"]["SetPasswordDto"];
export type SessionDto = components["schemas"]["SessionDto"];

// Тип для ответа /auth/login
export interface LoginResponse {
  message: string;
  access_token: string;
}

// Интерфейс для конфигурации клиента
interface ApiClientConfig {
  baseUrl: string;
  accessToken?: string;
  onUnauthorized?: () => void;
}

// Класс API клиента
class ApiClient {
  private client: ReturnType<typeof createClient<paths>>;
  private baseUrl: string;
  private accessToken: string | undefined;
  private onUnauthorized: (() => void) | undefined;
  private customFetch: (
    input: RequestInfo,
    init?: RequestInit
  ) => Promise<Response>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.accessToken = config.accessToken;
    this.onUnauthorized = config.onUnauthorized;

    this.customFetch = async (
      input: RequestInfo,
      init?: RequestInit
    ): Promise<Response> => {
      const response = await fetch(input, init);
      if (response.status === 401 && this.onUnauthorized) {
        this.onUnauthorized();
      }
      return response;
    };

    this.client = createClient<paths>({
      baseUrl: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
      },
      fetch: this.customFetch,
    });
  }

  // Публичный метод для получения токена
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  // Публичный метод для установки токена
  setAccessToken(token: string | undefined) {
    this.accessToken = token;
    this.client = createClient<paths>({
      baseUrl: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      fetch: this.customFetch,
    });
  }

  // Health API
  health = {
    check: () => this.client.GET("/health"),
  };

  // User API
  user = {
    getProfile: () =>
      this.client.GET("/user/profile"),
    updateProfile: (data: UpdateUserProfileDto) =>
      this.client.PATCH("/user/update-profile", { body: data }),
    changePassword: (data: ChangePasswordDto) =>
      this.client.PATCH("/user/me/change-password", { body: data }),
    getAccessLogs: () =>
      this.client.GET("/user/me/access-logs"),
    getAccessLogsByAdmin: (id: string) =>
      this.client.GET("/user/{id}/access-logs", {
        params: { path: { id } },
      }),
    setup2FA: () =>
      this.client.POST("/user/me/2fa/setup"),
    verify2FA: (data: Verify2FADto) =>
      this.client.POST("/user/me/2fa/verify", { body: data }),
  };

  // Admin User API
  adminUser = {
    createUser: (data: CreateUserByAdminDto) =>
      this.client.POST("/admin/users/create-user-by-admin", {
        body: data,
      }),
    getAllUsers: (params?: {
      role?: "user" | "admin";
      status?: "PENDING" | "ACTIVE" | "BLOCKED" | "DELETED";
      email?: string;
      page?: number;
      limit?: number;
    }) =>
      this.client.GET("/admin/users/find-all", { params: { query: params } }),
    getUserById: (id: string) =>
      this.client.GET("/admin/users/find-by-id/{id}", {
        params: { path: { id } },
      }),
    updateUser: (id: string, data: UpdateUserAdminDto) =>
      this.client.PATCH("/admin/users/update-by-admin/{id}", {
        params: { path: { id } },
        body: data,
      }),
    deleteUser: (id: string) =>
      this.client.DELETE("/admin/users/delete-by-admin/{id}", {
        params: { path: { id } },
      }),
    blockUser: (id: string) =>
      this.client.PATCH("/admin/users/users/{id}/block", {
        params: { path: { id } },
      }),
    unblockUser: (id: string) =>
      this.client.PATCH("/admin/users/users/{id}/unblock", {
        params: { path: { id } },
      }),
  };

  // Access Log API
  accessLog = {
    getLogs: (params?: {
      userId?: string;
      eventType?:
        | "REGISTER"
        | "LOGIN_SUCCESS"
        | "LOGIN_FAIL"
        | "EMAIL_VERIFIED"
        | "EMAIL_RESEND"
        | "EMAIL_FAILED"
        | "PASSWORD_CHANGED"
        | "ACCOUNT_BLOCKED"
        | "ACCOUNT_UNLOCKED"
        | "LOGIN_2FA_REQUIRED"
        | "ENABLE_2FA"
        | "DISABLE_2FA"
        | "LOGOUT"
        | "LOGIN_OAUTH_SUCCESS"
        | "LOGIN_OAUTH_FAIL"
        | "OAUTH_DISCONNECT"
        | "PASSWORD_SET_OAUTH_SUCCESS";
      ipAddress?: string;
      page?: number;
      limit?: number;
    }) => this.client.GET("/access-log", { params: { query: params } }),
  };

  // Auth API
  auth = {
    register: (data: RegisterDto) =>
      this.client.POST("/auth/register", { body: data }),
    verifyEmail: (token: string) =>
      this.client.GET("/auth/verify-email", { params: { query: { token } } }),
    resendVerification: (data: ResendVerificationDto) =>
      this.client.POST("/auth/resend-verification", { body: data }),
    login: (data: LoginDto) =>
      this.client.POST("/auth/login", { body: data }),
    logout: () => this.client.PATCH("/auth/logout"),
    refreshTokens: () => this.client.POST("/auth/refresh"),
    setPassword: (data: SetPasswordDto) =>
      this.client.POST("/auth/set-password", { body: data }),
  };

  // Session API
  session = {
    getMySessions: () =>
      this.client.GET("/users/me/sessions"),
    deleteOtherSessions: () => this.client.DELETE("/users/me/sessions"),
    deleteAllSessions: () => this.client.DELETE("/users/me/sessions/all"),
    deleteMySession: (id: string) =>
      this.client.DELETE("/users/me/sessions/{id}", {
        params: { path: { id } },
      }),
  };

  // Admin Session API
  adminSession = {
    getAllSessions: (params?: {
      page?: number;
      limit?: number;
      ipAddress?: string;
      device?: string;
      userId?: string;
    }) =>
      this.client.GET("/admin/sessions", {
        params: { query: params },
      }),
    deleteAllSessions: () => this.client.DELETE("/admin/sessions"),
    getUserSessions: (userId: string) =>
      this.client.GET("/admin/sessions/user/{userId}", {
        params: { path: { userId } },
      }),
    deleteSessionsByUserId: (userId: string) =>
      this.client.DELETE("/admin/sessions/user/{userId}", {
        params: { path: { userId } },
      }),
    deleteSession: (id: string) =>
      this.client.DELETE("/admin/sessions/{id}", { params: { path: { id } } }),
  };

  // OAuth API
  oauth = {
    googleAuth: () => this.client.GET("/auth/oauth/google"),
    googleCallback: () => this.client.GET("/auth/oauth/google/callback"),
    yandexAuth: () => this.client.GET("/auth/oauth/yandex"),
    yandexCallback: () => this.client.GET("/auth/oauth/yandex/callback"),
    disconnectOAuth: (provider: "google" | "yandex") =>
      this.client.DELETE("/auth/oauth/disconnect/{provider}", {
        params: { path: { provider } },
      }),
    getConnectedAccounts: (params?: {
      provider?: "google";
      page?: number;
      limit?: number;
    }) =>
      this.client.GET("/auth/oauth/accounts", { params: { query: params } }),
  };
}

// Функция для создания экземпляра клиента
export function createApiClient(config: ApiClientConfig) {
  return new ApiClient(config);
}

// Экспорт типов и экземпляра клиента
export type { ApiClient };
export const api = createApiClient({ baseUrl: "https://dev-auth.domlab.uz/" });
