import type { User } from "@/api/api";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type UserSelectProps = {
  users: User[];
  blackList?: string[];
  placeholder?: string;
  value?: string;
  onChange?: (userID: string) => void;
};

export function UserSelect(props: UserSelectProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(props?.value);

  const value = props?.value !== undefined ? props.value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    props?.onChange?.(val);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props?.placeholder ?? "Select a user"} />
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
