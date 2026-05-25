import { useGetUserById, useUpdateUser } from '@/api/hooks/use-users';
import { AuthContext } from '@/components/AuthContext';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PencilIcon } from 'lucide-react';
import { useContext, useState } from 'react';

interface RenameUserDialogProps {
  userId: string;
  onSuccess?: () => void;
}

export function RenameUserDialog({ userId, onSuccess }: RenameUserDialogProps) {
  const { user: loggedInUser } = useContext(AuthContext);
  const { data: user } = useGetUserById(userId);

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user?.username);
  const [error, setError] = useState('');

  const renameMutation = useUpdateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || username.trim() === '') {
      setError('Username is required');
      return;
    }

    if (username === user?.username) {
      setError('New username must be different');
      return;
    }

    renameMutation.mutate(
      { userId, data: { username } },
      {
        onSuccess: () => {
          setOpen(false);
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setUsername(user?.username);
      setError('');
    }
  };

  if (!user || user?.role === 'guest' || user?.id !== loggedInUser?.id)
    return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon />
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename User</DialogTitle>
          <DialogDescription>
            Change the username for {user.username}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={renameMutation.isPending}>
              {renameMutation.isPending ? 'Renaming...' : 'Rename User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
