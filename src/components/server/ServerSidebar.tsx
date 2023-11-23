import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import { ServerHeader } from './ServerHeader';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './ServerSearch';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { channel } from 'diagnostics_channel';
import { Separator } from '../ui/separator';
import { ServerSection } from './ServerSection';
import { ServerChannel } from './ServerChannel';
import { ServerMember } from './ServerMember';

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

export const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
};

export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: 'asc' } },
      members: { include: { profile: true }, orderBy: { role: 'asc' } },
    },
  });
  const textChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!server) {
    return redirect('/');
  }
  return (
    <div className=''>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Audio Channels',
                type: 'channel',
                data: audioChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannel?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members ',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile?.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
      <Separator className='my-2 rounded-md' />
      {!!textChannel?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='channels'
            channelType={ChannelType.TEXT}
            role={role}
            label='Text Channel'
          />
          {textChannel.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
      )}
      {!!audioChannel?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='channels'
            channelType={ChannelType.AUDIO}
            role={role}
            label='Voice Channel'
          />
          {audioChannel.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
      )}
      {!!videoChannel?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='channels'
            channelType={ChannelType.VIDEO}
            role={role}
            label='Video Channel'
          />
          {videoChannel.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
      )}
      {!!members?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='members'
            role={role}
            label='Members'
            server={server}
          />
          {members.map((member) => (
            <ServerMember key={member.id} member={member} server={server} />
          ))}
        </div>
      )}
    </div>
  );
};
