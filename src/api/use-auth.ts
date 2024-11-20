import useSWR from "swr";
import { useEffect } from "react";
import { HttpErrorResponse } from "@/models/http/HttpErrorResponse";
import { useNavigate } from "react-router-dom";
import { UserResponse } from "@/models/user/UserResponse";

interface AuthProps {
  middleware?: "auth" | "guest";
  redirectIfAuthenticated?: string;
}

export const useAuthGuard = ({
  middleware,
  redirectIfAuthenticated,
}: AuthProps) => {
  let navigate = useNavigate();

  // mutate => to call func twice (to get session)
  const {
    data: user,
    error,
    mutate,
  } = useSWR(
    // caching the response
    "/api/auth/me",
    async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/auth/me",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
          },
          credentials: "include",
        }
      );
      const json = await response.json();
      console.log(json);
      return json as UserResponse;
    }
  );

  const login = async ({
    onError,
    props,
  }: {
    onError: (errors: HttpErrorResponse | undefined) => void;
    props: any;
  }) => {
    onError(undefined);
    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      credentials: "include",
      body: JSON.stringify({
        email: props.email,
        password: props.password,
      }),
    })
      .then(() => mutate())
      .catch((err) => {
        const errors = err.response.data as HttpErrorResponse;
        onError(errors);
      });
  };

  const logout = async () => {
    if (!error) {
      await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        credentials: "include",
      }).then(() => mutate());
    }

    window.location.pathname = "/auth/login";
  };

  useEffect(() => {
    // If middleware is 'guest' and we have a user, redirect
    if (middleware === "guest" && redirectIfAuthenticated && user) {
      return navigate(redirectIfAuthenticated);
    }

    // If middleware is 'auth' and we have an error, logout
    if (middleware === "auth" && error) {
      logout();
    }
  }, [user, error]);

  return {
    user,
    login,
    logout,
    mutate,
  };
};
