import { useGetMe } from '@/api/hooks/use-me';

export function CurrentUser() {
  const { isPending, data: user } = useGetMe();

  if (isPending || !user) return null;

  return <div className="flex items-center gap-2">{user.username}</div>;
}
