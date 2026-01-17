import { CreateLeagueDialog } from '@/features/league/create-league-dialog/create-league-dialog'
import { LeagueList } from '@/features/league/list/league-list'

export function LeaguesPage() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Leagues</h1>
      <div className='flex justify-end items-center'>
        <CreateLeagueDialog />
      </div>
      <LeagueList />
    </div>
  )
}
