import { useGetLeagueMembers } from '@/api/hooks/use-leagues';
import { useMemo } from 'react';
import { UserSelect } from '../../../components/user-select';
import { CreateGuestUserDialog } from './create-guest-user-dialog';

type LeagueUserSelectProps = {
  leagueId: string;
  selectedIds: string[];
  value: string;
  placeholder?: string;
  onChange?: (userID: string) => void;
};

export function LeagueUserSelect({
  leagueId,
  selectedIds,
  value,
  placeholder,
  onChange,
}: LeagueUserSelectProps) {
  const { data: members } = useGetLeagueMembers(leagueId);

  const filteredUsers = useMemo(() => {
    if (!members || !Array.isArray(members)) return [];
    return members
      .filter((user) => user.id === value || !selectedIds.includes(user.id))
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [members, value, selectedIds]);

  const handleChange = (val: string) => {
    onChange?.(val);
  };

  if (!members || !Array.isArray(members)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex gap-4">
      <UserSelect
        users={filteredUsers}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      />
      <CreateGuestUserDialog
        leagueId={leagueId}
        onUserCreated={(user) => onChange?.(user.id)}
      />
    </div>
  );
}
