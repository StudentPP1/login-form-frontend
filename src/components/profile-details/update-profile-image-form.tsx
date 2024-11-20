import { useAuthGuard } from "@/api/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FileUpload from "../utils/file-upload";

export default function UpdateProfileImageForm() {
  const { user, mutate } = useAuthGuard({middleware: "auth"});

  const handleLogoChange = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/profile-picture", {
      method: "PATCH",
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      },
      credentials: "include",
      body: formData
    }).then(() => {
      toast.success("Profile picture updated successfully");
      mutate();
     }).catch((error) => {
      toast.error("Failed to update profile picture");
    });
  };

  return (
    <div className="flex gap-4 flex-col">
      <Label>Logo</Label>
      <FileUpload
        onFileSelect={(file) => handleLogoChange(file)}
        allowedTypes={["image/png", "image/jpg", "image/jpeg"]}
        onValidationError={(err) => {
          toast.error(err);
        }}
      >
        <Avatar className="w-16 h-16">
          <AvatarImage src={`data:image/png;base64,${user?.profileImage}`} />
          <AvatarFallback>
            {user?.firstName?.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
      </FileUpload>
    </div>
  );
}