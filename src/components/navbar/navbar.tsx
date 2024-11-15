import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { useAuthGuard } from "@/api/use-auth";
import { UserNav } from "./user-nav";

export const NavBar = () => {
  const { user } = useAuthGuard({ middleware: "guest" });

  return (
    <nav className="lg flex justify-between items-center bg-card py-2 px-4 z-10">
      <div>
        
      </div>
      <div>
        {user && (
            <UserNav />
          )}
 

        {!user && (
            <Link to={"/auth/login"}>
              <Button variant={"outline"}>Login</Button>
            </Link>
        )}
      </div>
    </nav>
  )
}