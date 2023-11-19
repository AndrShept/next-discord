import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { ChannelType, MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const POST = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile();
    const { name, type }: { name: string; type: ChannelType } =
      await req.json();

    if (!profile) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }
    if (!params.serverId) {
      return NextResponse.json('Server Id is missing!', { status: 400 });
    }
    if (!name && !type) {
      return NextResponse.json('name or type  is missing!', { status: 400 });
    }
    if (name === 'general') {
      return NextResponse.json('Name cannot be "general"', { status: 400 });
    }

    const newServer = await prisma.server.update({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: { channels: { create: { name, type, profileId: profile.id } } },
    });
    return NextResponse.json(newServer, { status: 200 });
  } catch (error) {
    console.log('[CREATE_CHANNEL]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
