import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { Button } from "./ui/button";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const queryCLient = useQueryClient();

  async function handleClick() {
    logout();
    queryCLient.invalidateQueries();
    navigate("/");
  }

  return (
    <Button onClick={handleClick} className="w-full justify-start gap-2" variant="ghost" size="sm">
      <LogOut className="size-4" />
      <span className="truncate">Logout</span>
    </Button>
  );
}
