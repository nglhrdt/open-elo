import { getUsers } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { UserListItem } from "./user-list-item";

export function UserList() {
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-4">
      <h2>User List</h2>
      {users?.map(user => <UserListItem key={user.id} user={user} />)}
    </div>
  );
}
