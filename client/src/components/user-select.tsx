import type { LeagueMember } from '@/api/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type UserSelectProps = {
  users: LeagueMember[];
  placeholder?: string;
  value?: string;
  onChange?: (userID: string) => void;
};

export function UserSelect({
  users,
  placeholder,
  value,
  onChange,
}: UserSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder ?? 'Select a user'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
