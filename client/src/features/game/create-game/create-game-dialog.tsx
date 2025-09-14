import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';

type CreateGameDialogProps = {
  children?: React.ReactNode;
};

export function CreateGameDialog(props: CreateGameDialogProps) {
  const { children } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <>
          {children}
        </>
      </DialogContent>
    </Dialog>
  );
}
