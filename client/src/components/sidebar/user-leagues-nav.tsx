import { useGetUserOwnedLeagues } from '@/api/hooks/use-users';
import { Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

type UserLeaguesNavProps = {
  userId: string;
};

export function UserLeaguesNav({ userId }: UserLeaguesNavProps) {
  const location = useLocation();

  const { data: leagues } = useGetUserOwnedLeagues(userId);

  if (!leagues || leagues.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{'My Leagues'}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {leagues.map((league) => (
            <SidebarMenuItem key={league.id}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === `/leagues/${league.id}`}
              >
                <Link
                  to={`/leagues/${league.id}/seasons/${league.currentSeasonId}`}
                >
                  <Trophy className="size-4" />
                  <span>{league.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
