import { Button } from "@/components/ui/button";
import { useState } from "react";

type SelectGoalsProps = {
  goals: number;
  maxGoals?: number;
  onSelect?: (goals: number) => void;
}

export function SelectGoals(props: SelectGoalsProps) {
  const maxGoals = props.maxGoals ?? 9;
  const [goals, setGoals] = useState(props.goals);

  function handleSelectGoal(i: number): void {
    setGoals(i);
    if (props.onSelect) props.onSelect(i);
  }

  return (
    <div className="grid gap-1 grid-cols-5">
      {Array.from({ length: maxGoals + 1 }).map((_, i) => <Button onClick={() => handleSelectGoal(i)} variant={goals === i ? 'default' : 'ghost'} key={i}>{i}</Button>)}
    </div>
  )
}
