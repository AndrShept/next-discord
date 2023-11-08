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
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { cn } from '@/lib/utils';

export const InviteModal = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const origin = useOrigin();
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const isModalOpen = isOpen && type === 'invite';

  const onCope = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/servers/${server?.id}/invite-code`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const data = await res.json();
        onOpen('invite', { server: data });
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
          <DialogTitle>Invite Friends</DialogTitle>
          <DialogDescription>
            Give your server a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-sm font-bold'>
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              disabled={isLoading}
              value={inviteUrl}
              className='border-0 focus-visible:ring-0 bg-secondary/50 focus-visible:ring-offset-0'
            />
            <Button
              className='relative'
              disabled={isLoading}
              onClick={onCope}
              size={'icon'}
            >
              {!copied ? (
                <Copy className='w-4 h-4' />
              ) : (
                <Check className='w-4 h-4 animate-in  fade-in-0 duration-200' />
              )}
              {copied && (
                <p className='text-green-600 text-xs animate-in fade-in-0 absolute -top-5 -right-[0px]'>
                  Copied
                </p>
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            className='text-sm mt-4'
            variant={'link'}
            size={'sm'}
          >
            Generate a new link{' '}
            <RefreshCcw
              className={cn('ml-2 h-4 w-4', isLoading && 'animate-spin')}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
