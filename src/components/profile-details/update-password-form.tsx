
import { useAuthGuard } from "@/api/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import ErrorFeedback from "@/components/utils/error-feedback";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
  .object({
    oldPassword: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;
export default function UpdatePasswordForm() {
  const { mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(
    undefined
  );

  const onSubmit = async (data: Schema) => {
    setErrors(undefined);
 
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/password", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      credentials: "include",
      body: JSON.stringify(data)
    }).then(() => {
      toast.success("Password updated successfully");
      mutate();
    }).catch((error) => {
      const errData = error.response.data as HttpErrorResponse;
      setErrors(errData);
    });
  };

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    reValidateMode: "onSubmit",
  });

  return (
    <div className="max-w-screen-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your current password {"(leave empty if you didn't set it)"}</FormLabel>
                <FormControl>
                  <Input type="password" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <Button type="submit">Update password</Button>
        </form>
      </Form>

      <ErrorFeedback data={errors} className="mt-2" />
    </div>
  );
}