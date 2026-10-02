import { useState } from 'react';
import { useDeleteMatch } from '@/api/hooks/use-seasons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';

export function DeleteMatchButton(props: { matchId: string }) {
  const { matchId } = props;
  const [open, setOpen] = useState(false);
  const deleteMatchMutation = useDeleteMatch();

  const handleDelete = () => {
    deleteMatchMutation.mutate(matchId, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-red-500" variant="ghost">
          <Trash /> Delete Match
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete match?</DialogTitle>
          <DialogDescription>
            Deleting this match will reset the ELO values of all its players to their values before the match. This
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMatchMutation.isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
