'use client';
import { ServerWithMembersWithProfile } from '@/lib/types/types';
import { ChannelType, MemberRole } from '@prisma/client';
import React from 'react';
import { ActionTooltip } from '../ActionTooltip';
import { Button } from '../ui/button';
import { Plus, Settings, icons } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  server?: ServerWithMembersWithProfile;
  channelType?: ChannelType;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className=' py-2'>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <div className='flex items-center justify-between text-muted-foreground px-1'>
          <p className='text-xs uppercase font-semibold'>{label}</p>
          <ActionTooltip label='Create Channel' side='top'>
            <Button
              onClick={() => onOpen('createChannel')}
              variant={'ghost'}
              size={'icon'}
              className=''
            >
              <Plus size={20} />
            </Button>
          </ActionTooltip>
          {role === MemberRole.ADMIN &&  sectionType !== 'channels' && (
            <ActionTooltip label='Create Channel' side='top'>
              <Button
                onClick={() => onOpen('members', {server})}
                variant={'ghost'}
                size={'icon'}
                className=''
              >
                <Settings size={20} />
              </Button>
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};
