import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json('Unauthorize', { status: 401 });
    }
    if (!params.serverId) {
      return NextResponse.json('Server Id MIssing', { status: 400 });
    }
    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        // profileId: { not: profile.id },
        members: { some: { profileId: profile.id } },
      },
      data: { members: { deleteMany: { profileId: profile.id } } },
    });
    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.log('[SERVER_ID]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
