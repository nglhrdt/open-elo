import { fetchCurrentUser } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function CurrentUser() {
  const { isPending, data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
  })

  if (isPending || !user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.username}
      <Avatar>
        <AvatarImage src={`https://avatar.iran.liara.run/username?username=${user.username}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
