
import { Link } from "react-router-dom";
import { UserAuthForm } from "./forms/user-auth-form";
import { NavBar } from "./navbar/navbar";

export const Login = () => {
    return (
        <div>
            <NavBar />
            <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full max-w-screen-sm mx-auto">

                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Login to your account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and password below to login to your account
                    </p>
                </div>

                <UserAuthForm />

                <p className="flex justify-center gap-x-2">
                    Don't have an account?
                    <Link to="/auth/register" className="underline">
                        Register
                    </Link>
                </p>

                <p className="flex justify-center gap-x-2">
                    Forgot your password?
                    <Link to="/auth/forgot-password" className="underline">
                        Request password reset
                    </Link>
                </p>

                <p className="px-8 text-sm text-center text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        to="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        to="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}