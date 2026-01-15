import { getLeagueById } from '@/api/api'
import { ModeToggle } from '@/components/mode-toggle'
import { CreateGame } from '@/features/game/create-game/create-game'
import { LeagueGames } from '@/features/league/games/league-games'
import { LeagueTable } from '@/features/user-ranking/league-table'
import { UserMenu } from '@/features/user/menu/user-menu'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export function LeaguePage() {
  const { leagueId } = useParams<{ leagueId: string }>()

  const { isPending, data: league } = useQuery({
    queryKey: ['league', leagueId],
    queryFn: () => getLeagueById(leagueId!),
    enabled: !!leagueId,
  })

  if (!leagueId) return <div>Invalid league</div>
  if (isPending) return <div>Loading...</div>
  if (!league) return <div>League not found</div>

  return (
    <div className='flex flex-col gap-4 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>{league.name}</h1>
        </div>
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 grow shrink gap-4 lg:gap-12'>
        <CreateGame leagueId={leagueId} />
        <LeagueTable leagueId={leagueId} />
        <LeagueGames leagueId={leagueId} />
      </div>
    </div>
  )
}
