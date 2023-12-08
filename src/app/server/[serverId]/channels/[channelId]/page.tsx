import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

const ChannelPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }
  const channel = await prisma.channel.findUnique({
    where: { id: params.channelId },
  });
  const member = await prisma.member.findFirst({
    where: { serverId: params.serverId, profileId: profile.id },
  });
  if (!channel || !member) {
    return redirect(`/server/${params.serverId}`);
  }
  return (
    <div className='flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId!}
        type='channel'
      />
      <div className='flex-1'>future message</div>
      <ChatInput
        name={channel.name}
        type='channel'
        apiUrl='/api/socket/messages'
        query={{
          channelId: channel.id,
          serverId: params.serverId,
        }}
      />
    </div>
  );
};

export default ChannelPage;
