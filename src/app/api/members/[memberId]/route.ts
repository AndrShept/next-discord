import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {

  try {
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json('Unauthorize', { status: 401 });
    }
    if (!params.memberId) {
      return NextResponse.json('member Id MIssing', { status: 400 });
    }
    const { serverId, role } = await req.json();
    const server = await prisma.server.update({
      where: { id: serverId },
      data: {
        members: { update: { where: { id: params.memberId }, data: { role } } },
      },
    });
    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.log('[SERVER_ID]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
