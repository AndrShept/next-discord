import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

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
      where: { id: params.serverId },
      data: { inviteCode: uuidv4() },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log('[SERVER_ID]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
