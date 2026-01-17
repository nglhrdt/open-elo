import { fetchUserRankings, type Ranking } from '@/api/api'
import { ModeToggle } from '@/components/mode-toggle'
import { RankingSelect } from '@/components/ranking-select'
import { CreateGame } from '@/features/game/create-game/create-game'
import { LeagueGames } from '@/features/league/games/league-games'
import { JoinLeagueCard } from '@/features/league/join/join-league-card'
import { LeagueTable } from '@/features/user-ranking/league-table'
import { UserMenu } from '@/features/user/menu/user-menu'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function HomePage() {
  const { isPending, data: rankings } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchUserRankings,
  })

  const [ranking, setRanking] = useState<Ranking | null>(null)
  useEffect(() => setRanking(rankings?.[0] ?? null), [rankings])

  if (isPending) return <div>Loading...</div>
  if (!rankings || rankings.length === 0) return <JoinLeagueCard />
  if (!ranking) return <div>No ranking selected</div>

  return (
    <div className='flex flex-col gap-4 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <h1 className='text-2xl font-bold'>{ranking.league.name}</h1>
        {rankings.length > 1 && <RankingSelect rankings={rankings} onChange={setRanking} />}
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 grow shrink gap-4 lg:gap-12'>
        <CreateGame leagueId={ranking.league.id} />
        <LeagueTable leagueId={ranking.league.id} />
        <LeagueGames leagueId={ranking.league.id} />
      </div>
    </div>
  )
}
