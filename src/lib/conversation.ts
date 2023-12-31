import { Conversation, Profile, Member } from '@prisma/client';
import { prisma } from './db/prisma';

export interface ConversationWithMemberProfile extends Conversation {
  memberOne: (Member & { profile: Profile  }) ;
  memberTwo: (Member & { profile: Profile }) ;
}

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  const conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await createNewConversation(memberOneId, memberTwoId));

  return conversation;
};

const findConversation = async (
  memberOneId: string,
  memberTwoId: string
)=> {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { AND: [{ memberOneId }, { memberTwoId }] },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
)  => {
  try {
    const newConversation = await prisma.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    });
    return newConversation;
  } catch (error) {
    return null;
  }
};
