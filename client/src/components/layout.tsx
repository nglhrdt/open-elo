import { Outlet } from "react-router";
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarInset } from './ui/sidebar';

export function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
