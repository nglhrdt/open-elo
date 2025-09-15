import type { Ranking } from "@/api/api";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type RankingSelectProps = {
  rankings: Ranking[];
  blackList?: string[];
  placeholder?: string;
  value?: string;
  onChange?: (ranking: Ranking | null) => void;
};

export function RankingSelect(props: RankingSelectProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(props?.value);

  const value = props?.value !== undefined ? props.value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    props?.onChange?.(props.rankings.find(r => r.id === val) ?? null);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props?.placeholder ?? "Select a user"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {props.rankings.map((ranking) => (
            <SelectItem key={ranking.id} value={ranking.id}>
              {ranking.league.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
