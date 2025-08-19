//src/shared/lib/error.ts
export interface ApiError {
  message: string;
  status: number;
}

export function parseApiError(error: unknown): ApiError {
  let message = "Неизвестная ошибка";
  let status = 500;

  if (error instanceof Error) {
    message = error.message;
    if ("status" in error) {
      status = Number(error.status);
    }
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    message = (error as { message: string }).message;
    if ("status" in error) {
      status = Number((error as { status: number }).status);
    }
  }

  return { message, status };
}
