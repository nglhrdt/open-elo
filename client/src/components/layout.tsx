import { Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-svh w-full flex flex-col">
      <div className="mx-auto grow shrink w-full max-w-screen-lg px-4 py-6 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
