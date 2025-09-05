import { fetchUserRankings } from "@/api/api"
import { AuthContext } from "@/components/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { JoinLeagueCard } from "../league/join/join-league-card"
import { RankingListItem } from "./ranking-list-item"

export function UserRankingList() {
  const { user } = useContext(AuthContext)
  const { isPending, data: rankings } = useQuery({
    queryKey: ['rankings', user?.id],
    queryFn: fetchUserRankings,
  })

  if (isPending) return <div>Loading...</div>

  if (rankings?.length === 0) return <JoinLeagueCard />

  return <>{rankings?.map((ranking) => <RankingListItem key={ranking.id} ranking={ranking} />)}</>
}
