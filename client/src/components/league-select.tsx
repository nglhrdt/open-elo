import { useGetLeagues } from '@/api/hooks/use-leagues';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type LeagueSelectProps = {
  leagueId?: string;
  playerId?: string;
  onSelectionChange?: (leagueId: string) => void;
};

export function LeagueSelect(props: LeagueSelectProps) {
  const { leagueId, playerId, onSelectionChange } = props;

  const { data: leagues } = useGetLeagues({ playerId });

  return (
    <Select value={leagueId} onValueChange={onSelectionChange}>
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
