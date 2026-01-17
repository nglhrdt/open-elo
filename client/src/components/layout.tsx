import { Outlet, useLocation } from "react-router";
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './ui/sidebar';
import { Menu } from 'lucide-react';

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
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4 lg:hidden">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SidebarTrigger>
          <h1 className="font-semibold">Open Elo</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
