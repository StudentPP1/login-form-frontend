import { Link } from "react-router-dom";
import { UserRegisterForm } from "./forms/register-form";
import { NavBar } from "./navbar/navbar";


export const Register = () => {
    return (
        <div>
            <NavBar />
            <div className="mt-4 md:mt-0 space-y-6 flex flex-col justify-center h-full max-w-screen-sm mx-auto">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create a new account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter the details below to create your account
                    </p>
                </div>
                
                <UserRegisterForm />

                <p className="flex justify-center gap-x-2">
                    Already have an account?
                    <Link to="/auth/login" className="underline">
                        Login
                    </Link>
                </p>

                <p className="px-8 text-sm text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
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