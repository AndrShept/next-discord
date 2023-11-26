import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { ChannelType, MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const DELETE = async (
  req: Request,
  { params }: { params: { channelId: string } }
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }
    if (!params.channelId) {
      return NextResponse.json('Channel Id is missing!', { status: 400 });
    }

    const channel = await prisma.channel.delete({
      where: { id: params.channelId },
    });
    return NextResponse.json('channel delete success', { status: 201 });
  } catch (error) {
    console.log('[DELETE_CHANNEL]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string; channelId: string } }
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
    if (!params.channelId) {
      return NextResponse.json('Channel Id is missing!', { status: 400 });
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
      data: {
        channels: {
          update: { where: { id: params.channelId }, data: { name, type } },
        },
      },
    });
    return NextResponse.json(newServer, { status: 200 });
  } catch (error) {
    console.log('[PATCH_CHANNEL]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
