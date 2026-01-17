import type { League } from "@/api/api";
import { getLeagueUsers } from "@/api/api";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Table2, Users, UserCheck, UserCog } from "lucide-react";
import { Link } from "react-router";

const leagueTypeConfig = {
  TABLE_SOCCER: {
    label: "Table Soccer",
    icon: Table2,
  },
  INDOOR_SOCCER: {
    label: "Indoor Soccer",
    icon: Users,
  },
} as const;

export function LeagueListItem(props: { league: League }) {
  const { league } = props;
  const config = leagueTypeConfig[league.type];
  const Icon = config.icon;

  const { data: users = [] } = useQuery({
    queryKey: ['leagueUsers', league.id],
    queryFn: () => getLeagueUsers(league.id),
  });

  const registeredCount = users.filter(u => u.role === 'user' || u.role === 'admin').length;
  const guestCount = users.filter(u => u.role === 'guest').length;

  return (
    <Link to={`/leagues/${league.id}`} className="block transition-opacity hover:opacity-80">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle>{league.name}</CardTitle>
              <CardDescription>{config.label}</CardDescription>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="size-4" />
                  <span>{registeredCount} {registeredCount === 1 ? 'member' : 'members'}</span>
                </div>
                {guestCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <UserCog className="size-4" />
                    <span>{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
