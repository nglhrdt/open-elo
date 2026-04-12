import { fetchLeagueById } from '@/api/api';
import { CreateUserDialog } from './create-user-dialog';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { UserSelect } from '../../../components/user-select';

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
  const { data: league, isPending } = useQuery({
    queryKey: ['leagues', leagueId],
    queryFn: () => fetchLeagueById(leagueId),
  });

  const filteredUsers = useMemo(() => {
    if (!league?.members || !Array.isArray(league.members)) return [];
    return league.members
      .filter((user) => user.id === value || !selectedIds.includes(user.id))
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [league?.members, value, selectedIds]);

  const handleChange = (val: string) => {
    onChange?.(val);
  };

  if (!league?.members || isPending || !Array.isArray(league.members)) {
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
      <CreateUserDialog
        leagueId={leagueId}
        onUserCreated={(user) => onChange?.(user.id)}
      />
    </div>
  );
}
