import { type User } from '@/api/api';
import { ConvertGuestDialog } from '@/features/user/convert/convert-guest-dialog';
import { RenameUserDialog } from '@/features/user/rename/rename-user-dialog';

interface PlayerHeaderProps {
  user: User;
}

export function PlayerHeader({ user }: PlayerHeaderProps) {
  const isGuest = user.role === 'guest';
  const isRegistered = user.role === 'user' || user.role === 'admin';

  return (
    <div className='flex items-center gap-4'>
      <h1 className='text-2xl font-bold'>{user.username}</h1>
      {isGuest && (
        <ConvertGuestDialog user={user} />
      )}
      {isRegistered && (
        <RenameUserDialog user={user} />
      )}
    </div>
  );
}
