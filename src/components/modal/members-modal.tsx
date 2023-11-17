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

import {
  Check,
  Copy,
  DonutIcon,
  Gavel,
  Loader2,
  MoreVertical,
  RefreshCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';

import { useOrigin } from '@/hooks/use-origin';
import { cn } from '@/lib/utils';
import { ServerWithMembersWithProfile } from '@/lib/types/types';
import { ScrollArea } from '../ui/scroll-area';
import { UserAvatar } from '../UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { server } = data as { server: ServerWithMembersWithProfile };
  const [loadingId, setLoadingId] = useState('');
  const isModalOpen = isOpen && type === 'members';
  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const res = await fetch(`/api/members/${memberId}`, {
        method: 'PATCH',
        body: JSON.stringify({ serverId: server.id, role }),
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
        onOpen('members', { server: data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
        body: JSON.stringify(server.id),
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
        onOpen('members', { server: data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
    ADMIN: <ShieldAlert className='h-4 w-4 text-rose-500' />,
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
          <DialogDescription>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members?.map((member) => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              <UserAvatar src={member.profile.imageUrl} />
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-muted-foreground '>
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id &&
                member.role !== 'ADMIN' && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='h-4 w-4 text-muted-foreground' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='flex items-center'>
                            <ShieldQuestion className='w-4 h-4 mr-2' />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'GUEST')}
                              >
                                <Shield className='h-4 w-4 mr-2' />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className='h-4 w-4 mr-2' />
                                MODERATOR
                                {member.role === 'MODERATOR' && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        {member.role !== 'GUEST' && (
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
                            <Gavel className='h-4 w-4 mr-2' />
                            Kick
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className='animate-spin text-muted-foreground ml-auto w-4 h-4' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
