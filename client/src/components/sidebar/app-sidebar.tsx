import { AuthContext } from '@/components/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home, User } from 'lucide-react';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router';
import { LogoutButton } from './logout-button';
import { ModeToggle } from './mode-toggle';
import { UserLeaguesNav } from './user-leagues-nav';

export function AppSidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Open Elo</span>
                <span className="truncate text-xs">
                  {user?.username || 'Guest'}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/leagues'}
                >
                  <Link to="/leagues">
                    <Home />
                    <span>All Leagues</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === `/profile`}
                  >
                    <Link to={`/profile`}>
                      <User />
                      <span>My Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user && <UserLeaguesNav userId={user.id} />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
