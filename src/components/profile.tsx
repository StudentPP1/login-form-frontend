import { useAuthGuard } from "@/api/use-auth";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Loading from "./utils/loading";
import { NavBar } from "./navbar/navbar";
import { Separator } from "./ui/separator";
import { format } from "date-fns"
import UpdateBasicDetailsForm from "./profile-details/update-basic-details-form";
import UpdatePasswordForm from "./profile-details/update-password-form";
import UpdateProfileImageForm from "./profile-details/update-profile-image-form";

export default function Profile() {
  const { user } = useAuthGuard({ middleware: "auth" });

  console.log(user)
  
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <FaGoogle />;
      case "github":
        return <FaGithub />;
      default:
        return <span>{provider}</span>;
    }
  };

  if (!user) return <Loading />;

  return (
    <>
    <NavBar/>
    <div className="m-4 md:mt-0 space-y-6 flex flex-col justify-center max-w-screen-sm mx-auto">

    <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-semibold">Welcome back, {user.firstName}</h1>
        
        <UpdateProfileImageForm />
        <Separator />

        <UpdateBasicDetailsForm />
        <Separator />

        <UpdatePasswordForm />
        <Separator />
      </div>
    </div>
    </>
  );
}