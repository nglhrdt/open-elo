import { fetchRankingsByUserId, getUserById, getUserGames } from "@/api/api";
import { PlayerGamesSection } from "@/features/user/player-games-section/player-games-section";
import { PlayerHeader } from "@/features/user/player-header/player-header";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";

export function PlayerPage() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLeagueId = searchParams.get("leagueId") || undefined;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedSeason, setSelectedSeason] = useState<
    number | "all" | "current"
  >("current");

  const { isPending: userLoading, data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  const { isPending: rankingsLoading, data: rankings } = useQuery({
    queryKey: ["userRankings", userId],
    queryFn: () => fetchRankingsByUserId(userId!),
    enabled: !!userId,
  });

  const { data: allGamesResponse } = useQuery({
    queryKey: ["userGamesMetadata", userId, selectedLeagueId],
    queryFn: () =>
      getUserGames(userId!, { count: 10000, leagueId: selectedLeagueId }),
    enabled: !!userId,
  });

  const allGames = allGamesResponse?.data || [];

  const userLeagues = rankings?.map((r) => r.league)?.filter(Boolean) || [];

  const availableSeasons = useMemo(() => {
    if (!allGames || allGames.length === 0) return [];
    return [...new Set(allGames.map((g) => g.seasonNumber))].sort(
      (a, b) => b - a,
    );
  }, [allGames]);

  const currentSeasonNumber = useMemo(() => {
    if (selectedLeagueId && selectedLeagueId !== "all") {
      const league = userLeagues.find((l) => l.id === selectedLeagueId);
      if (league?.currentSeasonNumber) {
        return league.currentSeasonNumber;
      }
    }
    return availableSeasons[0] || 1;
  }, [selectedLeagueId, userLeagues, availableSeasons]);

  const { isPending: gamesLoading, data: gamesResponse } = useQuery({
    queryKey: [
      "userGames",
      userId,
      selectedLeagueId,
      selectedSeason,
      pageIndex,
      pageSize,
      currentSeasonNumber,
    ],
    queryFn: () => {
      const params: {
        leagueId?: string;
        seasonNumber?: number;
        skip: number;
        take: number;
      } = {
        skip: pageIndex * pageSize,
        take: pageSize,
        leagueId: selectedLeagueId,
      };
      if (selectedSeason === "current") {
        params.seasonNumber = currentSeasonNumber;
      } else if (selectedSeason !== "all") {
        params.seasonNumber = selectedSeason;
      }
      return getUserGames(userId!, params);
    },
    enabled: !!userId && availableSeasons.length > 0,
  });

  const games = gamesResponse?.data || [];
  const totalGames = gamesResponse?.total || 0;

  const handleLeagueChange = (leagueId: string) => {
    if (leagueId === "all") {
      searchParams.delete("leagueId");
    } else {
      searchParams.set("leagueId", leagueId);
    }
    setSearchParams(searchParams);
    setPageIndex(0);
    setSelectedSeason("current");
  };

  const handleSeasonChange = (season: number | "all") => {
    setSelectedSeason(season);
    setPageIndex(0);
  };

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number,
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  if (!userId) return <div>Invalid player</div>;
  if (userLoading || gamesLoading || rankingsLoading)
    return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="flex flex-col gap-6 grow shrink">
      <div className="flex items-center justify-between gap-4 lg:gap-8 shrink-0">
        <PlayerHeader user={user} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <PlayerGamesSection
          userId={userId}
          games={games}
          totalGames={totalGames}
          userLeagues={userLeagues}
          selectedLeagueId={selectedLeagueId}
          onLeagueChange={handleLeagueChange}
          availableSeasons={availableSeasons}
          currentSeasonNumber={currentSeasonNumber}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
