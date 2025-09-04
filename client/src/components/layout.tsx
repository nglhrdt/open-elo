import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-svh w-full p-4">
      <Outlet />
    </div>
  )
}
