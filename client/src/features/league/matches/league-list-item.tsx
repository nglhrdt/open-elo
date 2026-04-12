import type { League } from '@/api/api';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Construction, UserCheck } from 'lucide-react';
import { Link } from 'react-router';

const leagueTypeConfig = {
  TABLE_SOCCER: {
    label: 'Table Soccer',
    icon: Construction,
  },
} as const;

export function LeagueListItem(props: { league: League }) {
  const { league } = props;
  const config = leagueTypeConfig[league.game];
  const Icon = config.icon;

  return (
    <Link
      to={`/leagues/${league.id}/seasons/${league.currentSeason.id}`}
      className="block transition-opacity hover:opacity-80"
    >
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
                  <span>
                    {league.members.length}{' '}
                    {league.members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
