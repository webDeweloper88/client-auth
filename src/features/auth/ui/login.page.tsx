import { useLoginMutation } from "@/features/auth/model/mutations"; // Импорт через public API
import { loginSchema, type LoginFormValues } from "@/features/auth/model/schemas"; // Импорт через public API
import type { AuthFormField } from "@/features/auth/ui/AuthForm"; // Импорт через public API
import { AuthForm } from "@/features/auth/ui/AuthForm"; // Импорт через public API
import { ROUTES } from "@/shared/model/routes"; // Импорт через public API

export function LoginPage() {
  const { mutate, isPending } = useLoginMutation();

  const fields: AuthFormField<LoginFormValues>[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      autoComplete: "email",
      placeholder: "you@example.com",
    },
    {
      name: "password",
      label: "Пароль",
      type: "password",
      autoComplete: "current-password",
      placeholder: "••••••••",
    },
  ];

  return (
    <AuthForm<LoginFormValues>
      schema={loginSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(values) => mutate(values)}
      isPending={isPending}
      title="Вход"
      description="Введите email и пароль, чтобы продолжить"
      link={{ text: "Нет аккаунта?", url: ROUTES.REGISTER }}
      fields={fields}
    />
  );
}

export const Component = LoginPage;
