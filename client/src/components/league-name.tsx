import { useGetLeagueById } from '@/api/hooks/use-leagues';

export function LeagueName({ leagueId }: { leagueId: string }) {
  const { data: league } = useGetLeagueById(leagueId);
  if (!league) return <div>Loading...</div>;
  return <h1 className="text-2xl font-bold">{league.name}</h1>;
}
