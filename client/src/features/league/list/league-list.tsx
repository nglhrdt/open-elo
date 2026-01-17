import { getLeagues, fetchUserRankings } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { LeagueListItem } from "./league-list-item";

export function LeagueList() {
  const { data: leagues } = useQuery({ queryKey: ['leagues'], queryFn: getLeagues });
  const { data: rankings } = useQuery({ queryKey: ['rankings'], queryFn: fetchUserRankings });

  const userLeagueIds = new Set(rankings?.map(r => r.league.id) || []);
  const myLeagues = leagues?.filter(league => userLeagueIds.has(league.id)) || [];
  const otherLeagues = leagues?.filter(league => !userLeagueIds.has(league.id)) || [];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-8">
      {myLeagues.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">My Leagues</h2>
          <div className="flex flex-col gap-4">
            {myLeagues.map(league => <LeagueListItem key={league.id} league={league} />)}
          </div>
        </div>
      )}
      {otherLeagues.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Other Leagues</h2>
          <div className="flex flex-col gap-4">
            {otherLeagues.map(league => <LeagueListItem key={league.id} league={league} />)}
          </div>
        </div>
      )}
    </div>
  );
}
