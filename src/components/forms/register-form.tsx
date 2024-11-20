import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse"
import React from "react"
import { toast } from "sonner";
import SuccessFeedback from "@/components/utils/success-feedback"
import { Link } from "react-router-dom"
import ErrorFeedback from "@/components/utils/error-feedback"
import { Label } from "../ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type Schema = z.infer<typeof registerSchema>;

export const UserRegisterForm = ({ }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    setErrors(undefined);
    setSuccess(false);
    setIsLoading(true);
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify(data)
    }).then((result) => {
      console.log(result)
      if (result.status == 200) {
        toast.success("Account created successfully");
        setSuccess(true);
      }
      else if (result.status == 422) {
        let errors: HttpErrorResponse = {
          message: "input is wrong",
          status: result.status,
        };
        setErrors(errors)
      }
      else {
        let errors: HttpErrorResponse = {
          message: "email is already using",
          status: result.status,
        };
        setErrors(errors)
      }
      setIsLoading(false);
    })

  }

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(registerSchema),
    reValidateMode: "onSubmit"
  });

  return (
    <div className="grid gap-6">
      <SuccessFeedback
        show={success}
        message="Account created"
        description="Verification email will be sent to your inbox, please click the link in the email to verify your account"
        action={
          <Link to="/auth/login" className="underline">
            Login
          </Link>
        }
      />

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

            <Label htmlFor="passwordConfirmation">Confirm password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              disabled={isLoading}
              {...register("passwordConfirmation")}
            />
            {formState.errors.passwordConfirmation && (
              <small className="text-red-600">
                {formState.errors.passwordConfirmation.message}
              </small>
            )}

            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("firstName")}
            />

            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("lastName")}
            />
          </div>

          <ErrorFeedback data={errors} />

          <Button disabled={isLoading} type="submit">
            {isLoading && 'Creating account...'}
            Register
          </Button>
        </div>
      </form>
    </div>
  )
}
