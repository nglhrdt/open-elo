import { fetchUserById } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ConvertGuestDialog } from './convert-guest-dialog';
import { DeleteGuestDialog } from './delete-guest-dialog';
import { RenameUserDialog } from './rename-user-dialog';

interface PlayerHeaderProps {
  userId: string;
}

export function PlayerHeader({ userId }: PlayerHeaderProps) {
  const { user: currentUser } = useContext(AuthContext);
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUserById(userId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isGuest = user.role === 'guest';
  const isRegistered = user.role === 'user' || user.role === 'admin';
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="flex items-center gap-4">
      <h1 className="text-2xl font-bold">{user.username}</h1>
      {isGuest && (
        <>
          <ConvertGuestDialog user={user} />
          <DeleteGuestDialog user={user} />
        </>
      )}
      {isRegistered && isOwnProfile && <RenameUserDialog user={user} />}
    </div>
  );
}
