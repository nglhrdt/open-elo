import { type User } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
import { ConvertGuestDialog } from '@/features/user/convert/convert-guest-dialog';
import { RenameUserDialog } from '@/features/user/rename/rename-user-dialog';
import { useContext } from 'react';

interface PlayerHeaderProps {
  user: User;
}

export function PlayerHeader({ user }: PlayerHeaderProps) {
  const { user: currentUser } = useContext(AuthContext);
  const isGuest = user.role === 'guest';
  const isRegistered = user.role === 'user' || user.role === 'admin';
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className='flex items-center gap-4'>
      <h1 className='text-2xl font-bold'>{user.username}</h1>
      {isGuest && (
        <ConvertGuestDialog user={user} />
      )}
      {isRegistered && isOwnProfile && (
        <RenameUserDialog user={user} />
      )}
    </div>
  );
}
