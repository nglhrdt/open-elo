import { getLeagueUsers } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { UserSelect } from "./user-select";

type LeagueUserSelectProps = {
  leagueId: string;
  selectedIds: string[];
  value: string;
  placeholder?: string;
  onChange?: (userID: string) => void;
};

export function LeagueUserSelect(props: LeagueUserSelectProps) {
  const { data: users, isPending } = useQuery({ queryKey: ['league', props.leagueId, 'users'], queryFn: () => getLeagueUsers(props.leagueId) });

  const handleChange = (val: string) => {
    props?.onChange?.(val);
  };

  if (!users || isPending) {
    return <div>Loading...</div>;
  }

  return (
    <UserSelect
      users={users.filter(user => user.id === props.value || !props.selectedIds.includes(user.id))}
      value={props.value}
      placeholder={props.placeholder}
      onChange={handleChange} />
  )
}
