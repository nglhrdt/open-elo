import FavoriteOpponent from './favorite-oponent';
import FavoriteTeamMate from './favorite-team-mate';
import SeasonMatchStats from './season-match-stats';

type PlayerStatsProps = {
  playerId: string;
  seasonId: string;
};

function PlayerStats({ playerId, seasonId }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 lg:gap-8">
      <SeasonMatchStats playerId={playerId} seasonId={seasonId} />
      <FavoriteOpponent playerId={playerId} seasonId={seasonId} />
      <FavoriteTeamMate playerId={playerId} seasonId={seasonId} />
    </div>
  );
}

export default PlayerStats;
