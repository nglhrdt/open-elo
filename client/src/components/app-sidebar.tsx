import { fetchUserRankings, getLeagueById } from '@/api/api'
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
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { Home, Key, Trophy, User } from 'lucide-react'
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

  const { data: tokenLeague } = useQuery({
    queryKey: ['tokenLeague', user?.leagueId],
    queryFn: () => getLeagueById(user!.leagueId!),
    enabled: !!user?.leagueId,
  })

  const leagues = rankings?.map(r => r.league) ?? []
  const isTokenUser = user?.role === 'guest'

  // For token users, show the league from their token
  const displayLeagues = isTokenUser && tokenLeague ? [tokenLeague] : leagues

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Open Elo</span>
                <span className="truncate text-xs">{user?.username || 'Guest'}</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {!isTokenUser && (
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
                {user && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/tokens'}>
                      <Link to="/tokens">
                        <Key />
                        <span>Tokens</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {displayLeagues.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{isTokenUser ? 'League' : 'My Leagues'}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {displayLeagues.map((league) => (
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
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
