import type { User } from "@/api/api";
import { Card } from "@/components/ui/card";

export function UserListItem(props: { user: User }) {
  const { user } = props;

  return (
    <Card>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 items-center">
          <span className="font-bold">{user.username}</span>
        </div>
      </div>
    </Card>
  );
}
