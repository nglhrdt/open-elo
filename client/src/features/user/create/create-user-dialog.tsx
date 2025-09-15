import { addPlayerToLeague, createUser, type User } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";

type CreateUserDialogProps = {
  leagueId: string;
  onUserCreated?: (user: User) => void;
}

export function CreateUserDialog(props: CreateUserDialogProps) {
  const queryClient = useQueryClient()
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async (user) => {
      await addPlayerToLeague({ leagueId: props.leagueId, userId: user.id })

      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['league', props.leagueId, 'users'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });

      props.onUserCreated?.(user)
    },
  })

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState<string>('');

  async function handleCreateUser() {
    await createUserMutation.mutateAsync({
      username,
      role: 'guest',
    })

    setUsername('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><UserPlus /></Button>
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
          onChange={e => setUsername(e.target.value)}
        />
        <DialogFooter>
          <div className="flex justify-end w-full">
            <Button onClick={handleCreateUser} disabled={createUserMutation.isPending}>Create</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
