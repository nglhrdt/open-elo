import type { League } from "@/api/api";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type LeagueSelectProps = {
  leagues: League[];
  blackList?: string[];
  placeholder?: string;
  value?: string;
  onChange?: (leagueId: string) => void;
};

export function LeagueSelect(props: LeagueSelectProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(props?.value);

  const value = props?.value !== undefined ? props.value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    props?.onChange?.(val);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props?.placeholder ?? "Select a league"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.leagues.map((league) => (
            <SelectItem key={league.id} value={league.id}>
              {league.name} ({league.type})
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
