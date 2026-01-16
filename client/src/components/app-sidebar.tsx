import { fetchUserRankings } from '@/api/api'
import { AuthContext } from '@/components/AuthContext'
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
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { Home, Trophy, User } from 'lucide-react'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { LogoutButton } from './logout-button'
import { ModeToggle } from './mode-toggle'

export function AppSidebar() {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  const { data: rankings } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchUserRankings,
    enabled: !!user,
  })

  const leagues = rankings?.map(r => r.league) ?? []

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Trophy className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Foosball Leagues</span>
                  <span className="truncate text-xs">{user?.username || 'Guest'}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/leagues'}>
                  <Link to="/leagues">
                    <Home />
                    <span>All Leagues</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === `/players/${user.id}`}>
                    <Link to={`/players/${user.id}`}>
                      <User />
                      <span>My Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {leagues.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>My Leagues</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {leagues.map((league) => (
                  <SidebarMenuItem key={league.id}>
                    <SidebarMenuButton asChild isActive={location.pathname === `/leagues/${league.id}`}>
                      <Link to={`/leagues/${league.id}`}>
                        <Trophy className="size-4" />
                        <span>{league.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <div className="flex-1 min-w-0">
                <LogoutButton />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
