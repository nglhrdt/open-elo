import FavoriteOpponent from './cards/favorite-oponent';
import FavoriteTeamMate from './cards/favorite-team-mate';
import SeasonElo from './cards/season-elo';
import SeasonMatchStats from './cards/season-match-stats';

type PlayerStatsProps = {
  playerId: string;
  seasonId: string;
};

function PlayerStats({ playerId, seasonId }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
      <SeasonElo playerId={playerId} seasonId={seasonId} />
      <SeasonMatchStats playerId={playerId} seasonId={seasonId} />
      <FavoriteTeamMate playerId={playerId} seasonId={seasonId} />
      <FavoriteOpponent playerId={playerId} seasonId={seasonId} />
    </div>
  );
}

export default PlayerStats;
