import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useCallback, useState } from 'react';

type CreateGameDialogProps = {
  children?: React.ReactNode;
  open?: boolean; // controlled open (optional)
  onOpenChange?: (open: boolean) => void; // controlled handler (optional)
};

export function CreateGameDialog(props: CreateGameDialogProps) {
  const { children, open: openProp, onOpenChange } = props;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = useCallback((next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className='w-full'>
          New Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Game</DialogTitle>
          <DialogDescription>
            Select the final score and the players that played the game.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
