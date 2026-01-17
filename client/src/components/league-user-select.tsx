import { getLeagueUsers } from "@/api/api";
import { CreateUserDialog } from "@/features/user/create/create-user-dialog";
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

  if (!users || isPending || !Array.isArray(users)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex gap-4">
      <UserSelect
        users={users.filter(user => user.id === props.value || !props.selectedIds.includes(user.id))}
        value={props.value}
        placeholder={props.placeholder}
        onChange={handleChange} />
      <CreateUserDialog leagueId={props.leagueId} onUserCreated={(user) => props.onChange?.(user.id)} />
    </div>
  )
}
