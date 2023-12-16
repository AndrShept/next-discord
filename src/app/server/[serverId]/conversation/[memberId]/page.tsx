import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { useSocket } from '@/components/providers/SocketProvider';
import {
  ConversationWithMemberProfile,
  getOrCreateConversation,
} from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

interface MemberIdPageProps {
  params: { serverId: string; memberId: string };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {

  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  const currentMember = await prisma.member.findFirst({
    where: { profileId: params.memberId, serverId: params.serverId },
    include: { profile: true },
  });
  if (!currentMember) {
    return redirect(`/server/${params.serverId}`);
  }
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  const { memberOne, memberTwo } =
    conversation as ConversationWithMemberProfile;
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
      <ChatMessages />
      <ChatInput/>
 
    </div>
  );
};

export default MemberIdPage;
