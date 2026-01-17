import { CurrentUser } from "@/components/current-user";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Trophy } from "lucide-react";
import { Link } from "react-router";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <CurrentUser />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Button className="w-full flex justify-center" variant="ghost">
            <Link to="/leagues">Leagues</Link>
            <Trophy />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
