import { createToken, getLeagues } from "@/api/api";
import { LeagueSelect } from "@/components/league-select";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateTokenDialog() {
  const queryClient = useQueryClient();
  const { data: leagues = [] } = useQuery({ queryKey: ['leagues'], queryFn: getLeagues });

  const mutation = useMutation({
    mutationFn: createToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });

  const [leagueId, setLeagueId] = useState<string>('');
  const [validityDays, setValidityDays] = useState<number>(1);
  const [open, setOpen] = useState(false);

  async function handleCreateToken() {
    if (!leagueId) {
      return;
    }

    await mutation.mutateAsync({
      leagueId,
      validityDays,
    });

    setLeagueId('');
    setValidityDays(1);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Token</DialogTitle>
          <DialogDescription>
            Create a new access token for a league. Choose the league and validity period.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="league" className="text-sm font-medium">
              League
            </label>
            <LeagueSelect leagues={leagues} onChange={setLeagueId} value={leagueId} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="validity" className="text-sm font-medium">
              Valid For
            </label>
            <Select
              value={validityDays.toString()}
              onValueChange={(value) => setValidityDays(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateToken} disabled={!leagueId}>
            Create Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
