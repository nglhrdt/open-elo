import { fetchCurrentUser } from "@/api/api";
import { CurrentUser } from "@/components/current-user";
import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { Outlet, redirect } from "react-router";

export function ProtectedRoute() {
  const { isPending, data } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
  })

  if (isPending) return <div>Loading...</div>
  if (!data) redirect('/login')

  return (
    <div className="flex flex-col gap-4">
      <div className='flex justify-between items-center'>
        <CurrentUser />
        <div className='flex gap-2 items-center'>
          <ModeToggle />
          <LogoutButton />
        </div>
      </div>
      <Outlet />
    </div>
  )
}
