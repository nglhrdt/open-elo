import { type LEAGUE_TYPE } from "@/api/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const types: LEAGUE_TYPE[] = ["TABLE_SOCCER", "INDOOR_SOCCER"];

export function LeagueTypeSelect(props?: {
  placeholder?: string;
  value?: LEAGUE_TYPE;
  onChange?: (leagueType: LEAGUE_TYPE) => void;
}) {
  return (
    <Select value={props?.value} onValueChange={props?.onChange}>
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
