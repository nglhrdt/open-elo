import { getLeagues } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { LeagueListItem } from "./league-list-item";

export function LeagueList() {
  const { data: leagues } = useQuery({ queryKey: ['leagues'], queryFn: getLeagues });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-4">
      {leagues?.map(league => <LeagueListItem key={league.id} league={league} />)}
    </div>
  );
}
