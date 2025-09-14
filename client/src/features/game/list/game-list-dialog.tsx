import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';

type GameListDialogProps = {
  children?: React.ReactNode;
  triggerButtonText?: string;
};

export function GameListDialog(props: GameListDialogProps) {
  const { children, triggerButtonText = 'Last Games' } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full'>
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{triggerButtonText}</DialogTitle>
        </DialogHeader>
        <>
          {children}
        </>
      </DialogContent>
    </Dialog>
  );
}
