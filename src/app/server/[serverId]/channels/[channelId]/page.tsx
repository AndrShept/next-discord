import { MediaRoom } from '@/components/MediaRoom';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { ChannelType } from '@prisma/client';
import { ChevronsDown } from 'lucide-react';
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
    <section className='flex flex-col h-full  relative  '>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId!}
        type='channel'
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <div className=' flex-1 '>
            <ChatMessages
              member={member}
              name={channel.name}
              chatId={channel.id}
              type='channel'
              apiUrl='/api/messages'
              socketUrl='/api/socket/messages'
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              paramKey='channelId'
              paramValue={channel.id}
            />
          </div>
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{
              channelId: channel.id,
              serverId: params.serverId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom audio={true} video={false} chatId={channel.id} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom audio={true} video={true} chatId={channel.id} />
      )}
    </section>
  );
};

export default ChannelPage;
