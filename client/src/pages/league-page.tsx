import { getLeagueById, fetchUserRankings } from '@/api/api'
import { CreateGame } from '@/features/game/create-game/create-game'
import { LeagueGames } from '@/features/league/games/league-games'
import { JoinLeagueButton } from '@/features/league/join/join-league-button'
import { SeasonSettings } from '@/features/league/settings/season-settings'
import { LeagueTable } from '@/features/user-ranking/league-table'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { AuthContext } from '@/components/AuthContext'
import { useContext } from 'react'

export function LeaguePage() {
  const { leagueId } = useParams<{ leagueId: string }>()
  const { user } = useContext(AuthContext)

  const { isPending: leagueLoading, data: league } = useQuery({
    queryKey: ['league', leagueId],
    queryFn: () => getLeagueById(leagueId!),
    enabled: !!leagueId,
  })

  const { data: rankings } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchUserRankings,
  })

  const isMember = rankings?.some(r => r.league.id === leagueId) ?? false
  const isGuest = user?.role === 'guest'
  const isOwner = user?.id === league?.owner?.id

  if (!leagueId) return <div>Invalid league</div>
  if (leagueLoading) return <div>Loading...</div>
  if (!league) return <div>League not found</div>

  return (
    <div className='flex flex-col gap-4 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>{league.name}</h1>
          {league.seasonEnabled && league.currentSeasonNumber && (
            <p className='text-sm text-muted-foreground'>
              Season {league.currentSeasonNumber}
              {league.seasonEndDate && ` • Ends ${new Date(league.seasonEndDate).toLocaleDateString()}`}
            </p>
          )}
        </div>
        <div className='flex items-center gap-4'>
          {!isMember && !isGuest && <JoinLeagueButton leagueId={leagueId} />}
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12 items-start'>
        <CreateGame leagueId={leagueId} />
        <LeagueGames leagueId={leagueId} />
        <LeagueTable leagueId={leagueId} />
      </div>
      {isOwner && (
        <div className='mt-8'>
          <SeasonSettings league={league} />
        </div>
      )}
    </div>
  )
}
