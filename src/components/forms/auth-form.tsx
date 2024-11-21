import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"
import { useAuthGuard } from "@/api/use-auth"
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse"
import { toast } from "sonner"
import ErrorFeedback from "@/components/utils/error-feedback"
import { Label } from "../ui/label"
import { Link } from "react-router-dom"
import { FaGithub, FaGoogle} from "react-icons/fa";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Schema = z.infer<typeof loginFormSchema>;

export function UserAuthForm() {
  const [isLoading] = React.useState<boolean>(false);
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

  function getProviderLoginUrl(provider: 'google' | 'facebook' | 'github' | 'okta') {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const REDIRECT_URI = API_BASE_URL + `/oauth2/callback/${provider}`;
    const AUTH_URL = API_BASE_URL + `/oauth2/authorize/${provider}?redirect_uri=` + REDIRECT_URI;
    return AUTH_URL;
  }

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
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <Link to={getProviderLoginUrl('github')}>
          <Button variant="outline" type="button" disabled={isLoading} className="w-full">
            <FaGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </Link>
        
        <Link to={getProviderLoginUrl('google')}>
          <Button variant="outline" type="button" disabled={isLoading} className="w-full">
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </Link>
      </div>

    </div>
  )
}
