import { createLeague, type LEAGUE_TYPE } from "@/api/api";
import { LeagueTypeSelect } from "@/components/league-type-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CreateLeagueDialog() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createLeague,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  })

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<LEAGUE_TYPE>('TABLE_SOCCER');
  const [open, setOpen] = useState(false);

  async function handleCreateLeague() {
    await mutation.mutateAsync({
      name,
      type,
    })

    setName('');
    setType('TABLE_SOCCER');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create League</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Game</DialogTitle>
          <DialogDescription>
            Select the final score and the players that played the game.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <LeagueTypeSelect onChange={setType} value={type} />
        <DialogFooter>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateLeague}>Create League</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
