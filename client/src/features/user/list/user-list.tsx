import { getLeagueUsers, type User } from "@/api/api";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { UserGames } from "../games/user-games-dialog";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'user',
    header: 'Username',
    cell: (info) => { return <UserGames user={info.row.original} /> },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => info.row.original.role === 'guest' ? "GUEST" : info.getValue()
  },
];

type UserListProps = {
  leagueId: string;
}

export function UserList(props: UserListProps) {
  const { data: users, isPending } = useQuery({
    queryKey: ['league', props.leagueId, 'users'],
    queryFn: () => getLeagueUsers(props.leagueId),
  });

  if (isPending) return <div>Loading...</div>
  if (!users) return <div>No users found</div>

  return (
    <DataTable columns={columns} data={users} />
  )
}
