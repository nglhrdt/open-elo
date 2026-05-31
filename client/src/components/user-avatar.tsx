import { useGetUserById } from '@/api/hooks/use-users';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function UserAvatar({
  userId,
  size = 'size-16',
  showName = false,
}: {
  userId: string;
  size?: string;
  showName?: boolean;
}) {
  const { data: user } = useGetUserById(userId);
  if (!user) return null;

  const avatarSrc = user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : undefined;
  const initials = user.username.slice(0, 2).toUpperCase();

  return showName ? (
    <div className="flex gap-2 items-center">
      <Avatar className={size}>
        <AvatarImage src={avatarSrc} alt={user.username} />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="text-primary hover:underline">{user.username}</div>
    </div>
  ) : (
    <Avatar className={size}>
      <AvatarImage src={avatarSrc} alt={user.username} />
      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
