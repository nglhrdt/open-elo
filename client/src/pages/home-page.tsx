import { UserRankings } from '@/features/user-ranking/user-rankings'

export function HomePage() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <UserRankings />
    </div>
  )
}
