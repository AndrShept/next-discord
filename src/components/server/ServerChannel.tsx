'use client';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Trash2, Video } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ActionTooltip } from '../ActionTooltip';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const Icon = iconMap[channel.type];

  return (
    <Button
      className={cn(
        'w-full group flex text-muted-foreground  transition justify-start mb-1',
        {
          'bg-secondary text-secondary': params.serverId === channel.id,
        }
      )}
      variant={'ghost'}
    >
      <Icon
        size={17}
        className={cn('', {
          'text-green-500 group-hover:text-green-400': channel.name === 'general',
        })}
      />
      <p
        className={cn('line-clamp-1 font-semibold text-sm ml-3 ', {
          'text-green-500 group-hover:text-green-400': channel.name === 'general',
        })}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className='ml-auto space-x-1'>
          <ActionTooltip label='Edit'>
            <Edit
              size={17}
              strokeWidth={1.5}
              className='hidden group-hover:inline'
            />
          </ActionTooltip>
          <ActionTooltip label='Delete'>
            <Trash2
              size={17}
              strokeWidth={1.5}
              className='hidden group-hover:inline text-rose-600'
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && <Lock size={17} className='ml-auto' />}
    </Button>
  );
};
