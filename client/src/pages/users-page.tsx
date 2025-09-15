import { getLeagues } from '@/api/api'
import { Button } from '@/components/ui/button'
import { CreateUserDialog } from '@/features/user/create/create-user-dialog'
import { UserList } from '@/features/user/list/user-list'
import { useQuery } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { Link } from 'react-router'

export function UsersPage() {
  const { isPending, data: leagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: getLeagues,
  });

  if (isPending) return <div>Loading...</div>
  if (!leagues) return <div>No leagues found</div>

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Users</h1>
      <div className='flex justify-between items-center'>
        <Button>
          <Link to={'/'}>Back</Link>
          <Home />
        </Button>
        <CreateUserDialog leagueId={leagues[0].id} />
      </div>
      <UserList leagueId={leagues[0].id} />
    </div>
  )
}
