import { UserRankingList } from '@/features/user-ranking/user-ranking-list'

export function HomePage() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <UserRankingList />
    </div>
  )
}
