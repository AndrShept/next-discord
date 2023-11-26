import { prisma } from '@/lib/db/prisma';
import React from 'react';

const ChannelPage = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const channel = await prisma.channel.findUnique({
    where: { id: params.channelId },

  });

  return <div>{params.channelId}</div>;
};

export default ChannelPage;
