import { getLeagues } from "@/api/api";
import { LeagueSelect } from "@/components/league-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { JoinLeagueButton } from "./join-league-button";

export function JoinLeagueCard() {
  const { isPending, data: leagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: getLeagues,
  });

  const [selectedLeague, setSelectedLeague] = useState<string | null>(leagues && leagues.length > 0 ? leagues[0].id : null);

  if (isPending) return <div>Loading...</div>
  if (!leagues) return <div>No leagues found</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join League</CardTitle>
        <CardDescription>You are not part of any leage. Join one to get started.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <LeagueSelect leagues={leagues} onChange={setSelectedLeague} />
        <JoinLeagueButton leagueId={selectedLeague} />
      </CardContent>
    </Card>
  )
}
