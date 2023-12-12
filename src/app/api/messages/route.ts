import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  try {
    const profile = currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');

    if (!profile) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 400 });
    }
    if (!channelId) {
      return NextResponse.json(
        { message: 'Channel ID missing' },
        { status: 400 }
      );
    }

    let messages: Message[] = [];

    const MESSAGES_BATCH = 10;
    if (cursor) {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { channelId},
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      messages = await prisma.message.findMany({
        take: MESSAGES_BATCH,
        where: { channelId},
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
};
