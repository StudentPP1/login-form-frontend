import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import SuccessFeedback from "@/components/utils/success-feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ErrorFeedback from "@/components/utils/error-feedback";
import { NavBar } from "./navbar/navbar";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type Schema = z.infer<typeof forgotPasswordSchema>;
export default function ForgotPassword() {
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>();
  const [success, setSuccess] = React.useState<boolean>(false);

  async function onSubmit(data: Schema) {
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/forgot-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      credentials: "include",
      body: JSON.stringify(data)
    }).then(() => {
      setSuccess(true);
    }).catch((error) => {
      const errData = error.response.data as HttpErrorResponse;
      setErrors(errData);
    });
  }

  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(forgotPasswordSchema),
    reValidateMode: "onSubmit",
  });

  return (
    <>
    <NavBar/>
    <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full max-w-screen-sm mx-auto">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send you a reset link
        </p>
      </div>

      <div className={"grid gap-6"}>
        <SuccessFeedback show={success} message="Password reset email sent" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              {...register("email")}
            />
            {formState.errors.email && (
              <small className="text-red-600">
                {formState.errors.email.message}
              </small>
            )}
          </div>

          <Button type="submit" className="w-full mt-2">
            Send reset email
          </Button>
        </form>

        <ErrorFeedback data={errors} />
      </div>
    </div>
    </>
  );
}