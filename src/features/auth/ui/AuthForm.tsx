import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldValues,
  type Path,
  type DefaultValues,
  type Resolver,
} from "react-hook-form";
import { Link } from "react-router-dom";
import { type ZodTypeAny } from "zod";
import { ROUTES } from "@/shared/model/routes";

export interface AuthFormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: "text" | "email" | "password" | "select";
  autoComplete?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface AuthFormProps<T extends FieldValues> {
  schema: ZodTypeAny;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => void;
  isPending: boolean;
  error?: { message: string; status: number };
  title: string;
  description: string;
  link: { text: string; url: string };
  fields: AuthFormField<T>[];
}

export function AuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  isPending,
  error,
  title,
  description,
  link,
  fields,
}: AuthFormProps<T>) {
  type ZodResolverParam = Parameters<typeof zodResolver>[0];
  const resolver = zodResolver(schema as ZodResolverParam) as Resolver<T>;
  const form = useForm<T>({
    resolver,
    defaultValues,
    mode: "onTouched",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit((vals) => onSubmit(vals))}
              className="space-y-4"
            >
              {fields.map((field) => {
                const { error: fieldError } = form.getFieldState(
                  field.name as Path<T>
                );
                const errorMessage = fieldError?.message as string | undefined;
                return (
                  <div key={field.name as string} className="space-y-2">
                    <Label htmlFor={field.name as string}>{field.label}</Label>
                    {field.type === "select" ? (
                      <select
                        id={field.name as string}
                        disabled={isPending}
                        className="w-full border rounded-md p-2"
                        {...form.register(field.name as Path<T>)}
                      >
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.name as string}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        disabled={isPending}
                        {...form.register(field.name as Path<T>)}
                      />
                    )}
                    {errorMessage && (
                      <p className="text-sm text-destructive">{errorMessage}</p>
                    )}
                  </div>
                );
              })}
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Отправка..." : title}
              </Button>
            </form>
            <div className="mt-4 text-sm text-center text-muted-foreground">
              {link.text}{" "}
              <Link to={link.url} className="text-primary hover:underline">
                {link.url === ROUTES.REGISTER ? "Зарегистрироваться" : "Войти"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
