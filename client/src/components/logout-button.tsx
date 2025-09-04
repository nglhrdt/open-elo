import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Button } from "./ui/button";

export function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const queryCLient = useQueryClient();

  async function handleClick() {
    logout();
    queryCLient.invalidateQueries();
    window.location.href = "/login";
  }

  return (
    <Button onClick={handleClick}>
      Logout
    </Button>
  );
}
