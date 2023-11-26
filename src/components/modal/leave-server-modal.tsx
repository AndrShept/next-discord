'use client';
import React, { ReactNode, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export const LeaveSeverModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const isModalOpen = isOpen && type === 'leaveServer';

  const onLeave = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/servers/${server?.id}/leave`, {
        method: 'PATCH',
      });
      if (res.ok) {
        onClose();
        router.refresh();
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Server</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave server{' '}
            <span className='text-green-500'>{server?.name}</span> ?
            <div className='mx-auto space-x-2 mt-4'>
              <Button disabled={isLoading}  onClick={onLeave} variant={'destructive'}>
                Confirm{' '}
                {isLoading && <Loader2 className='w-4 h-4 ml-2 animate-spin' />}
              </Button>
              <Button disabled={isLoading}  onClick={onClose} variant={'outline'}>
                Cancel
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
