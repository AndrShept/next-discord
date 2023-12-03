import { ChatHeader } from '@/components/chat/ChatHeader';
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
    <div>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId!}
        type='channel'
      />
    </div>
  );
};

export default ChannelPage;
