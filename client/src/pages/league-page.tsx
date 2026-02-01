import { getLeagueById, fetchUserRankings, getAvailableSeasons } from '@/api/api'
import { CreateGame } from '@/features/game/create-game/create-game'
import { LeagueGames } from '@/features/league/games/league-games'
import { JoinLeagueButton } from '@/features/league/join/join-league-button'
import { SeasonSettings } from '@/features/league/settings/season-settings'
import { LeagueTable } from '@/features/user-ranking/league-table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router'
import { AuthContext } from '@/components/AuthContext'
import { useContext, useState, useEffect } from 'react'

export function LeaguePage() {
  const { leagueId } = useParams<{ leagueId: string }>()
  const { user } = useContext(AuthContext)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSeason, setSelectedSeason] = useState<number | undefined>(() => {
    const seasonParam = searchParams.get('season')
    return seasonParam ? Number(seasonParam) : undefined
  })

  const { isPending: leagueLoading, data: league } = useQuery({
    queryKey: ['league', leagueId],
    queryFn: () => getLeagueById(leagueId!),
    enabled: !!leagueId,
  })

  // Fetch available seasons from the new endpoint
  const { data: availableSeasons = [] } = useQuery({
    queryKey: ['availableSeasons', leagueId],
    queryFn: () => getAvailableSeasons(leagueId!),
    enabled: !!leagueId,
  })

  const { data: rankings } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchUserRankings,
  })

  // Update selectedSeason when URL changes (browser back/forward)
  useEffect(() => {
    const seasonParam = searchParams.get('season')
    if (seasonParam) {
      setSelectedSeason(Number(seasonParam))
    }
  }, [searchParams])

  // Set selected season to current season when league loads (if not set from URL)
  useEffect(() => {
    if (league && selectedSeason === undefined && league.currentSeasonNumber) {
      setSelectedSeason(league.currentSeasonNumber)
      setSearchParams({ season: league.currentSeasonNumber.toString() })
    }
  }, [league, selectedSeason, setSearchParams])

  // Update URL when season changes
  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season)
    setSearchParams({ season: season.toString() })
  }

  const isMember = rankings?.some(r => r.league.id === leagueId) ?? false
  const isGuest = user?.role === 'guest'
  const isOwner = user?.id === league?.owner?.id
  const isCurrentSeason = selectedSeason === league?.currentSeasonNumber

  // Calculate days remaining until season ends
  const getDaysRemaining = () => {
    if (!league?.seasonEndDate) return null;
    const endDate = new Date(league.seasonEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  if (!leagueId) return <div>Invalid league</div>
  if (leagueLoading) return <div>Loading...</div>
  if (!league) return <div>League not found</div>

  return (
    <div className='flex flex-col gap-4 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <h1 className='text-2xl font-bold'>{league.name}</h1>
            {availableSeasons.length > 0 && (
              <Select
                value={selectedSeason?.toString()}
                onValueChange={(value) => handleSeasonChange(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {availableSeasons.map((season) => (
                    <SelectItem key={season} value={season.toString()}>
                      Season {season}
                      {season === league.currentSeasonNumber && ' (Current)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {isOwner && (
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <SeasonSettings league={league} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          {league.seasonEnabled && league.currentSeasonNumber && (
            <p className='text-sm text-muted-foreground'>
              Season {league.currentSeasonNumber}
              {league.seasonEndDate && (
                <>
                  {' • Ends '}
                  {new Date(league.seasonEndDate).toLocaleDateString()}
                  {daysRemaining !== null && (
                    <span className={daysRemaining <= 7 ? 'text-orange-500 font-medium' : ''}>
                      {' '}({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
                    </span>
                  )}
                </>
              )}
            </p>
          )}
        </div>
        <div className='flex items-center gap-4'>
          {!isMember && !isGuest && <JoinLeagueButton leagueId={leagueId} />}
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12 items-start'>
        {isCurrentSeason && <CreateGame leagueId={leagueId} />}
        <LeagueGames leagueId={leagueId} seasonNumber={selectedSeason} />
        <LeagueTable leagueId={leagueId} seasonNumber={selectedSeason} />
      </div>
    </div>
  )
}
