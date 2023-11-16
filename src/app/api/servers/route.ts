import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const POST = async (req: Request) => {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json('Unathorized', { status: 401 });
    }

    const newServer = await prisma.server.create({
      data: {
        imageUrl,
        name,
        inviteCode: uuidv4(),
        channels: { create: { name: 'general', profileId: profile.id } },
        members: {
          create: {
            profileId: profile.id,
            role: 'ADMIN',
          },
        },
      },
    });
    return NextResponse.json(newServer, { status: 201 });
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return NextResponse.json('Inrernal Error', { status: 500 });
  }
};
