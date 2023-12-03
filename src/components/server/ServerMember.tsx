'use client';
import { Member, Profile, Server } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { roleIconMap } from './ServerSidebar';
import { UserAvatar } from '../UserAvatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { SocketIndicator } from '../SocketIndicator';

interface ServerMemberProps {
  member: Member & { profile: Profile | null };
  server: Server;
}

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    router.push(`/server/${params?.serverId}/conversation/${member.profileId}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex px-2  py-4 items-center rounded-md group  dark:group-hover:text-white group-hover:text-black hover:bg-secondary transition  justify-start',
        {
          'bg-secondary ': params?.memberId === member.profileId,
        }
      )}
    >
      <UserAvatar
        className='h-8 w-8 md:h-8 md:w-8'
        src={member.profile?.imageUrl!}
      />
      <p
        className={cn(
          'font-semibold ml-4 text-muted-foreground group-hover:text-black dark:group-hover:text-white ',
          {
            'dark:text-white text-black ': params?.memberId === member.profileId,
          }
        )}
      >
        {member.profile?.name}
      </p>
     
      <div className='ml-auto'>{icon}</div>
    </button>
  );
};
