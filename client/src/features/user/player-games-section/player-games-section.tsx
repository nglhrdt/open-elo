import type { Game, League } from "@/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EloChart } from "@/features/user/elo-chart/elo-chart";
import { PlayerFilters } from "@/features/user/player-filters/player-filters";
import { PlayerGamesTable } from "@/features/user/player-games-table/player-games-table";
import { useMemo } from "react";

interface PlayerGamesSectionProps {
  userId: string;
  games: Game[];
  totalGames: number;
  userLeagues: League[];
  selectedLeagueId: string | undefined;
  onLeagueChange: (leagueId: string) => void;
  availableSeasons: number[];
  currentSeasonNumber: number;
  selectedSeason: number | "all" | "current";
  onSeasonChange: (season: number | "all") => void;
  pageIndex: number;
  pageSize: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
}

export function PlayerGamesSection({
  userId,
  games,
  totalGames,
  userLeagues,
  selectedLeagueId,
  onLeagueChange,
  availableSeasons,
  currentSeasonNumber,
  selectedSeason,
  onSeasonChange,
  pageIndex,
  pageSize,
  onPaginationChange,
}: PlayerGamesSectionProps) {
  const leagueTitle = useMemo(() => {
    if (!selectedLeagueId || selectedLeagueId === "all") return "All Leagues";
    return (
      userLeagues.find((l) => l.id === selectedLeagueId)?.name ?? "Recent Games"
    );
  }, [selectedLeagueId, userLeagues]);

  const chartData = useMemo(() => {
    if (!games || games.length === 0) return [];

    return games
      .map((game, index) => {
        const player = game.players.find((p) => p.user.id === userId);
        const homePlayers = game.players.filter((p) => p.team === "home");
        const awayPlayers = game.players.filter((p) => p.team === "away");
        const homeNames = homePlayers.map((p) => p.user.username).join(", ");
        const awayNames = awayPlayers.map((p) => p.user.username).join(", ");
        const eloChange = player ? player.eloAfter - player.eloBefore : 0;

        return {
          gameNumber: pageIndex * pageSize + index + 1,
          elo: player?.eloAfter ?? 0,
          date: new Date(game.createdAt).toLocaleDateString(),
          score: game.score,
          homeTeam: homeNames,
          awayTeam: awayNames,
          eloChange,
          league: game.league?.name,
        };
      })
      .filter((data) => data.elo > 0);
  }, [games, userId, pageIndex, pageSize]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{leagueTitle}</CardTitle>
          <PlayerFilters
            userLeagues={userLeagues}
            selectedLeagueId={selectedLeagueId}
            onLeagueChange={onLeagueChange}
            availableSeasons={availableSeasons}
            currentSeasonNumber={currentSeasonNumber}
            selectedSeason={selectedSeason}
            onSeasonChange={onSeasonChange}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {games.length > 0 ? (
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">ELO Progression</h3>
              <EloChart data={chartData} showLabels={true} />
            </div>
            <PlayerGamesTable
              games={games}
              userId={userId}
              selectedLeagueId={selectedLeagueId}
              pageIndex={pageIndex}
              totalCount={totalGames}
              onPaginationChange={onPaginationChange}
            />
          </>
        ) : (
          <p className="text-muted-foreground">No games yet</p>
        )}
      </CardContent>
    </Card>
  );
}
