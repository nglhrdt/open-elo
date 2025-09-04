import { type LEAGUE_TYPE } from "@/api/api";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function LeagueTypeSelect(props?: {
  placeholder?: string,
  value?: LEAGUE_TYPE,
  onChange?: (leagueType: LEAGUE_TYPE) => void
}) {
  const [internalValue, setInternalValue] = useState<string | undefined>(props?.value);

  const value = props?.value !== undefined ? props.value : internalValue;

  const handleChange = (val: LEAGUE_TYPE) => {
    setInternalValue(val);
    props?.onChange?.(val);
  };

  const types: LEAGUE_TYPE[] = ["TABLE_SOCCER", "INDOOR_SOCCER"];

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props?.placeholder ?? "Select a type"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {types.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
