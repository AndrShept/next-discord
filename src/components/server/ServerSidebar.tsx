import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';
import { ServerHeader } from './ServerHeader';

export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    include: {
      channel: { orderBy: { createdAt: 'asc' } },
      member: { include: { profile: true }, orderBy: { role: 'asc' } },
    },
  });
  const textChannel = server?.channel.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannel = server?.channel.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannel = server?.channel.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.member.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.member.find(
    (member) => member.profileId === profile.id
  )?.role;

  if (!server) {
    redirect('/');
  }
  return <div className=''>
    <ServerHeader server={server} role={role}/>
  </div>;
};
