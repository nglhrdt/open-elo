import { useRemoveMember } from '@/api/hooks/use-leagues';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { UserRoundX } from 'lucide-react';

type LeagueMemberProps = {
  leagueId: string;
  userId: string;
  username: string;
};

function LeagueMember({ leagueId, userId, username }: LeagueMemberProps) {
  const mutation = useRemoveMember(leagueId);

  return (
    <div
      key={userId}
      className="p-2 border-b flex items-center justify-between"
    >
      <div>{username}</div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserRoundX className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the member from the league.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutate(userId)}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LeagueMember;
