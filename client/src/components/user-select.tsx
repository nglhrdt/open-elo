import type { User } from "@/api/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type UserSelectProps = {
  users: User[];
  placeholder?: string;
  value?: string;
  onChange?: (userID: string) => void;
};

export function UserSelect(props: UserSelectProps) {
  return (
    <Select value={props.value} onValueChange={props.onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props.placeholder ?? "Select a user"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
