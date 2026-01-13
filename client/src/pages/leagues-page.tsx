import { Button } from '@/components/ui/button'
import { CreateLeagueDialog } from '@/features/league/create-league-dialog/create-league-dialog'
import { LeagueList } from '@/features/league/list/league-list'
import { Home } from 'lucide-react'
import { Link } from 'react-router'

export function LeaguesPage() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Leagues</h1>
      <div className='flex justify-between items-center'>
        <Button>
          <Link to={'/'}>Back</Link>
          <Home />
        </Button>
        <CreateLeagueDialog />
      </div>
      <LeagueList />
    </div>
  )
}
