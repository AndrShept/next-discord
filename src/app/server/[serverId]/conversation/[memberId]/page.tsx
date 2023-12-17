import { MediaRoom } from '@/components/MediaRoom';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { useSocket } from '@/components/providers/SocketProvider';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

interface MemberIdPageProps {
  params: { serverId: string; memberId: string };
  searchParams: { video: boolean };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }
  const currentMember = await prisma.member.findFirst({
    where: { profileId: profile.id, serverId: params.serverId },
    include: { profile: true },
  });
  if (!currentMember) {
    return redirect(`/`);
  }
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne?.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className=' flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember?.profile?.name!}
        serverId={params.serverId}
        type='conversation'
      />
      {searchParams.video && (
        <MediaRoom audio={true} video={true} chatId={conversation.id} />
      )}
   {!searchParams.video &&   <>
        <ChatMessages
          member={currentMember}
          name={otherMember?.profile?.name!}
          chatId={conversation.id}
          type='conversation'
          apiUrl='/api/direct-messages'
          paramKey='conversationId'
          paramValue={conversation.id}
          socketUrl='/api/socket/direct-messages'
          socketQuery={{
            conversationId: conversation?.id!,
          }}
        />
        <ChatInput
          name={otherMember?.profile?.name!}
          type='conversation'
          apiUrl='/api/socket/direct-messages'
          query={{
            conversationId: conversation.id,
          }}
        />
      </>}
    </div>
  );
};

export default MemberIdPage;
