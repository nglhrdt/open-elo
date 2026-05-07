import { useCreateGuestUser } from '@/api/hooks/use-leagues';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { User } from '@open-elo/shared';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';

type CreateUserDialogProps = {
  leagueId: string;
  onUserCreated?: (user: User) => void;
};

export function CreateGuestUserDialog(props: CreateUserDialogProps) {
  const createGuestUserMutation = useCreateGuestUser(props.leagueId);

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string>('');

  async function handleCreateUser() {
    const user = await createGuestUserMutation.mutateAsync(username);

    setUsername('');
    setOpen(false);

    props.onUserCreated?.(user);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          value={username}
          placeholder="Username"
          autoFocus
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <DialogFooter>
          <div className="flex justify-end w-full">
            <Button
              onClick={handleCreateUser}
              disabled={createGuestUserMutation.isPending}
            >
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
