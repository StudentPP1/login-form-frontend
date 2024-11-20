import { useAuthGuard } from "@/api/use-auth";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ErrorFeedback from "@/components/utils/error-feedback";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

type Schema = z.infer<typeof schema>;
export default function UpdateBasicDetailsForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });
  const [errors, setErrors] = React.useState<HttpErrorResponse | undefined>(undefined);

  const onSubmit = async (data: Schema) => {
    setErrors(undefined);
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/update-details", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include",
      body: JSON.stringify(data)
    }).then((result) => {
      console.log(result.json())
      toast.success("Profile updated successfully");
      mutate();
    }).catch((error) => {
      const errData = error.response.data as HttpErrorResponse;
      setErrors(errData);
    });
  };

  useEffect(() => {
    if (user) {
      form.setValue("firstName", user.firstName || '');
      form.setValue("lastName", user.lastName || '');
    }
  }, [user])

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    reValidateMode: "onSubmit",
    defaultValues: {
      firstName: user!.firstName,
      lastName: user!.lastName
    }
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <Button type="submit">Update profile</Button>
        </form>
      </Form>

      <ErrorFeedback data={errors} />
    </div>
  );
}