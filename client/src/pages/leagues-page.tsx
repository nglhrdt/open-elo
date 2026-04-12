import { AuthContext } from '@/components/AuthContext'
import { CreateLeagueDialog } from '@/features/league/create-league-dialog/create-league-dialog'
import { LeagueList } from '@/features/league/matches/league-list'
import { useContext } from 'react'

export function LeaguesPage() {
  const { user } = useContext(AuthContext)
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Leagues</h1>
      <div className='flex justify-end items-center'>
        <CreateLeagueDialog />
      </div>
      {user && <LeagueList user={user} />}
    </div>
  )
}
