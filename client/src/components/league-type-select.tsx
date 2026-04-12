import { type GAME } from "@/api/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const types: GAME[] = ["TABLE_SOCCER"];

export function LeagueTypeSelect(props?: {
  placeholder?: string;
  value?: GAME;
  onChange?: (leagueType: GAME) => void;
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
