import { Conversation } from '@prisma/client';
import { prisma } from './db/prisma';

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<Conversation | null> => {
  const conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await createNewConversation(memberOneId, memberTwoId));

  return conversation;
};

const findConversation = async (
  memberOneId: string,
  memberTwoId: string
): Promise<Conversation | null> => {
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
): Promise<Conversation | null> => {
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
