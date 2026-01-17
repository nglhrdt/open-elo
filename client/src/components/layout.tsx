import { Outlet, useLocation } from "react-router";
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarInset } from './ui/sidebar';

export function Layout() {
  const location = useLocation();
  const showSidebar = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register');

  if (!showSidebar) {
    return (
      <div className="flex flex-1 flex-col min-h-screen">
        <Outlet />
      </div>
    );
  }

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
