import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";
import { SidebarMenuButton } from "./ui/sidebar";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const queryCLient = useQueryClient();

  async function handleClick() {
    logout();
    queryCLient.clear();
    navigate("/login");
  }

  return (
    <SidebarMenuButton onClick={handleClick} tooltip="Logout">
      <LogOut className="size-4" />
      <span>Logout</span>
    </SidebarMenuButton>
  );
}
