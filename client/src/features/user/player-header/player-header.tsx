import { type User } from '@/api/api';
import { ConvertGuestDialog } from '@/features/user/convert/convert-guest-dialog';
import { Link } from 'react-router';

interface PlayerHeaderProps {
  user: User;
}

export function PlayerHeader({ user }: PlayerHeaderProps) {
  const isGuest = user.role === 'guest';

  return (
    <div className='flex flex-col gap-2'>
      <Link to="/" className='text-sm text-muted-foreground hover:underline'>
        ← Back to Home
      </Link>
      <div className='flex items-center gap-4'>
        <h1 className='text-2xl font-bold'>{user.username}</h1>
        {isGuest && (
          <ConvertGuestDialog user={user} />
        )}
      </div>
    </div>
  );
}
