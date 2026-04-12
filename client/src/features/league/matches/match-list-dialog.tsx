import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';

type MatchListDialogProps = {
  children?: React.ReactNode;
  triggerButtonText?: string;
};

export function MatchListDialog(props: MatchListDialogProps) {
  const { children, triggerButtonText = 'Last Matches' } = props;
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
