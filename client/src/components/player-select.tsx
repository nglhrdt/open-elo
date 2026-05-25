import { useGetLeagueMembers } from '@/api/hooks/use-leagues';
import { useNavigate } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type PlayerSelectProps = {
  leagueId: string;
  playerId: string;
  seasonId: string;
};

export function PlayerSelect(props: PlayerSelectProps) {
  const { leagueId, playerId, seasonId } = props;

  const { data: members } = useGetLeagueMembers(leagueId);

  const navigate = useNavigate();

  function handlePlayerChange(selectedPlayerId: string): void {
    navigate(
      `/leagues/${leagueId}/seasons/${seasonId}/players/${selectedPlayerId}`,
    );
  }

  return (
    <Select value={playerId} onValueChange={handlePlayerChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select player" />
      </SelectTrigger>
      <SelectContent>
        {members?.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
