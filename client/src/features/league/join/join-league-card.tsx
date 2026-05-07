import { LeagueSelect } from '@/components/league-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { JoinLeagueButton } from './join-league-button';

export function JoinLeagueCard() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<
    string | undefined
  >();

  const handleLeagueChange = (league: string) => {
    setSelectedLeagueId(league);
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
        <LeagueSelect
          leagueId={selectedLeagueId}
          onSelectionChange={handleLeagueChange}
        />
        {selectedLeagueId && <JoinLeagueButton leagueId={selectedLeagueId} />}
      </CardContent>
    </Card>
  );
}
