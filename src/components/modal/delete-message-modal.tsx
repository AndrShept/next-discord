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

export const DeleteMessageModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === 'deleteMessage';
  const messageId = apiUrl?.split('/').pop()
  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(apiUrl!, {
        method: 'DELETE',
        body: JSON.stringify({...query, messageId})
      });
      if (res.ok) {
        onClose();
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
          <DialogTitle>Delete Message</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete message{' '}
            <span className='text-green-500'>{}</span> ?
            <div className='mx-auto space-x-2 mt-4'>
              <Button
                disabled={isLoading}
                onClick={onDelete}
                variant={'destructive'}
                className='focus-visible:ring-0 focus-visible:ring-offset-0'
              >
                Confirm{' '}
                {isLoading && <Loader2 className='w-4 h-4 ml-2 animate-spin' />}
              </Button>
              <Button
                disabled={isLoading}
                onClick={onClose}
                variant={'outline'}
                className='focus-visible:ring-0 focus-visible:ring-offset-0'
              >
                Cancel
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
