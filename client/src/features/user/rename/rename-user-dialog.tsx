import { updateUser, type User } from '@/api/api';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';

interface RenameUserDialogProps {
  user: User;
  onSuccess?: () => void;
}

export function RenameUserDialog({ user, onSuccess }: RenameUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: () => updateUser(user.id, { username }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', user.id] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      queryClient.invalidateQueries({ queryKey: ['userGames', user.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
      setError('');
      onSuccess?.();
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to rename user');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || username.trim() === '') {
      setError('Username is required');
      return;
    }

    if (username === user.username) {
      setError('New username must be different');
      return;
    }

    renameMutation.mutate();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setUsername(user.username);
      setError('');
    }
  };

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
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
