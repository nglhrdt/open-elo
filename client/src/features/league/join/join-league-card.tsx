import { getLeagues, type League } from '@/api/api';
import { LeagueSelect } from '@/components/league-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CreateLeagueDialog } from '../create-league-dialog/create-league-dialog';
import { JoinLeagueButton } from './join-league-button';

export function JoinLeagueCard() {
  const { isPending, data: leagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: getLeagues,
  });

  const [selectedLeague, setSelectedLeague] = useState<League | null>(
    leagues && leagues.length > 0 ? leagues[0] : null,
  );

  if (isPending) return <div>Loading...</div>;
  if (!leagues) return <div>No leagues found</div>;

  const handleLeagueChange = (leagueId: string) => {
    const league = leagues.find((l) => l.id === leagueId) || null;
    setSelectedLeague(league);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join League</CardTitle>
        <CardDescription>
          You are not part of any league. Join one to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {leagues.length === 0 ? (
          <CreateLeagueDialog />
        ) : (
          <>
            <LeagueSelect leagues={leagues} onChange={handleLeagueChange} />
            {selectedLeague && (
              <JoinLeagueButton leagueId={selectedLeague.id} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
