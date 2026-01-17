import { fetchCurrentUser } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

export function CurrentUser() {
  const { isPending, data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
  })

  if (isPending || !user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.username}
    </div>
  );
}
