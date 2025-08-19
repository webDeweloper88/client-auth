import { useRegisterMutation } from "@/features/auth/model/mutations"; // Импорт через public API
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/model/schemas"; // Импорт через public API
import type { AuthFormField } from "@/features/auth/ui/AuthForm"; // Импорт через public API
import { AuthForm } from "@/features/auth/ui/AuthForm"; // Импорт через public API
import { ROUTES } from "@/shared/model/routes"; // Импорт через public API

export function RegisterPage() {
  const { mutate, isPending } = useRegisterMutation();

  const fields: AuthFormField<RegisterFormValues>[] = [
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
      autoComplete: "new-password",
      placeholder: "••••••••",
    },
    {
      name: "displayName",
      label: "Имя",
      type: "text",
      autoComplete: "name",
      placeholder: "John Doe",
    },
  ];

  return (
    <AuthForm<RegisterFormValues>
      schema={registerSchema}
      defaultValues={{ email: "", password: "", displayName: "" }}
      onSubmit={(values) => mutate(values)}
      isPending={isPending}
      title="Регистрация"
      description="Создайте аккаунт, чтобы начать"
      link={{ text: "Уже есть аккаунт?", url: ROUTES.LOGIN }}
      fields={fields}
    />
  );
}

export const Component = RegisterPage;
