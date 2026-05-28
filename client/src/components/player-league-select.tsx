import { useNavigate } from 'react-router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useGetUserJoinedLeagues } from '@/api/hooks/use-leagues';

type LeagueSelectProps = {
  leagueId: string;
  playerId: string;
  seasonId: string;
};

export function PlayerLeagueSelect(props: LeagueSelectProps) {
  const { leagueId, playerId, seasonId } = props;

  const { data: leagues } = useGetUserJoinedLeagues(playerId);

  const navigate = useNavigate();

  function handleLeagueChange(selectedLeagueId: string): void {
    navigate(
      `/leagues/${selectedLeagueId}/seasons/${seasonId}/players/${playerId}`,
    );
  }

  return (
    <Select value={leagueId} onValueChange={handleLeagueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={'Select a league'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {leagues?.map((league) => (
            <SelectItem key={league.id} value={league.id}>
              {league.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
