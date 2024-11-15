import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { useAuthGuard } from "@/api/use-auth"
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse"
import { toast } from "sonner"
import ErrorFeedback from "@/utils/error-feedback"
import { Label } from "../ui/label"

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Schema = z.infer<typeof loginFormSchema>;

export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {login} = useAuthGuard({middleware: 'guest', redirectIfAuthenticated: '/profile'});
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);

  async function onSubmit(data: Schema) {
    login({
      onError: (errors) => {
        setErrors(errors)
        if (errors) {
          toast.error("Authentication failed");
        }
      },
      props: data,
    })
  }

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onSubmit",
  });

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {formState.errors.email && (
              <small className="text-red-600">
                {formState.errors.email.message}
              </small>
            )}

            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {formState.errors.password && (
              <small className="text-red-600">
                {formState.errors.password.message}
              </small>
            )}
          </div>

          <ErrorFeedback data={errors} />
          
          <Button disabled={isLoading} type="submit">
            {isLoading && 'Logging in...'}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  )
}
