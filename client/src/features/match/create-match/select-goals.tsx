import { Button } from "@/components/ui/button";

type SelectGoalsProps = {
  goals: number;
  maxGoals?: number;
  onSelect?: (goals: number) => void;
}

export function SelectGoals(props: SelectGoalsProps) {
  const maxGoals = props.maxGoals ?? 9;

  function handleSelectGoal(i: number): void {
    if (props.onSelect) props.onSelect(i);
  }

  return (
    <div className="grid gap-1 grid-cols-5">
      {Array
        .from({ length: maxGoals + 1 })
        .map((_, i) => {
          return <Button
            onClick={() => handleSelectGoal(i)}
            variant={props.goals === i ? 'default' : 'ghost'}
            key={i}>
            {i}
          </Button>
        })}
    </div>
  )
}
