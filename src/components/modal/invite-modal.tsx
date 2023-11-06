'use client';
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import z from 'zod';

import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Copy, RefreshCcw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useParams, usePathname } from 'next/navigation';

export const InviteModal = () => {
  const params = useParams()
  const pathname = usePathname()
  const { isOpen, onClose, type, data } = useModal();
  const {server} = data
  const origin = useOrigin()
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`
  const isModalOpen = isOpen && type === 'invite';

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
              value={inviteUrl}
              className='border-0 focus-visible:ring-0 bg-secondary/50 focus-visible:ring-offset-0'
            />
            <Button size={'icon'}>
              <Copy className='w-4 h-4' />
            </Button>
          </div>
          <Button className='text-sm mt-4' variant={'link'} size={'sm'}>
            Generate a new link <RefreshCcw className='ml-2 h-4 w-4'/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
