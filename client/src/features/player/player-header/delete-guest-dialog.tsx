import { useDeleteUser, useGetUserById } from '@/api/hooks/use-users';
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
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface DeleteGuestDialogProps {
  userId: string;
}

export function DeleteGuestDialog({ userId }: DeleteGuestDialogProps) {
  const { data: user } = useGetUserById(userId);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useDeleteUser();

  if (user?.role !== 'guest') return null;

  function handleDeleteUser(): void {
    deleteMutation.mutate(userId, {
      onSuccess: () => {
        setOpen(false);
        navigate('/leagues');
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Guest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Guest User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the guest user "{user.username}"?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-3 text-sm">
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold text-foreground">What will happen:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                <li>The guest user will be permanently deleted</li>
                <li>Current season rankings will be removed</li>
                <li>Historical season data will be preserved</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
              <p className="font-semibold text-yellow-700 dark:text-yellow-500">
                Important:
              </p>
              <p className="text-muted-foreground mt-1">
                This user can only be deleted if they have no games in the
                current season.
              </p>
            </div>
          </div>
        </div>
        {deleteMutation.isError && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {(deleteMutation.error as Error).message}
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteUser()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Guest User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
