import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import SuccessFeedback from "@/components/utils/success-feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ErrorFeedback from "@/components/utils/error-feedback";
import { Button } from "../ui/button";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    passwordResetToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );
  const [success, setSuccess] = React.useState<boolean>(false);

  const token = new URLSearchParams(document.location.search).get("token");
  console.log(token)

  async function onSubmit(data: Schema) {
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password", {
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
    resolver: zodResolver(resetPasswordSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      passwordResetToken: token || undefined,
    },
  });

  return (
    <div className={"grid gap-6"}>
      <SuccessFeedback
        show={success}
        message="Password updated successfully"
        action={
          <Link to="/auth/login" className="underline">
            Login
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {formState.errors.password && (
              <small className="text-red-600">
                {formState.errors.password.message}
              </small>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {formState.errors.confirmPassword && (
              <small className="text-red-600">
                {formState.errors.confirmPassword.message}
              </small>
            )}
          </div>

          <ErrorFeedback data={errors} />

          <Button type="submit">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}