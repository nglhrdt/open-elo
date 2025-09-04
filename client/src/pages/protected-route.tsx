import { fetchCurrentUser } from "@/api/api";
import { CurrentUser } from "@/components/current-user";
import { LogoutButton } from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router";

export function ProtectedRoute() {
  const navigate = useNavigate()
  const { isPending, data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
  })

  if (isPending) return <div>Loading...</div>
  if (!user) {
    navigate('/login')
    return null
  }

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
