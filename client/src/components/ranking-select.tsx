import type { Ranking } from "@/api/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type RankingSelectProps = {
  rankings: Ranking[];
  placeholder?: string;
  value?: string;
  onChange?: (ranking: Ranking | null) => void;
};

export function RankingSelect(props: RankingSelectProps) {
  const handleChange = (val: string) => {
    props.onChange?.(props.rankings.find((r) => r.id === val) ?? null);
  };

  return (
    <Select value={props.value} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={props.placeholder ?? "Select a ranking"} />
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
