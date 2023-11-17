import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const { serverId, role } = (await req.json()) as {
      serverId: string;
      role: MemberRole;
    };
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json('Unauthorize', { status: 401 });
    }
    if (!params.memberId) {
      return NextResponse.json('member Id MIssing', { status: 400 });
    }
    if (!serverId) {
      return NextResponse.json('server Id MIssing', { status: 400 });
    }
    const server = await prisma.server.update({
      where: { id: serverId },
      data: {
        members: { update: { where: { id: params.memberId }, data: { role } } },
      },
      include: {
        members: { include: { profile: true }, orderBy: { role: 'asc' } },
      },
    });

    const test = await prisma.server.findFirst({
      where: {id: serverId, profileId: params.memberId},
    })
    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.log('[MEMBER_ID]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
export const DELETE = async (
  req: Request,
  { params }: { params: { memberId: string } }
) => {
  try {
    const  serverId  = await req.json();
    const profile = await currentProfile();
    console.log(serverId)
    if (!profile) {
      return NextResponse.json('Unauthorize', { status: 401 });
    }
    if (!params.memberId) {
      return NextResponse.json('member Id MIssing', { status: 400 });
    }
    if (!serverId) {
      return NextResponse.json('server Id MIssing', { status: 400 });
    }
    const server = await prisma.server.update({
      where: { id: serverId },
      data: {
        members: { delete: { id: params.memberId } , },
        
      },
      include: {
        members: { include: { profile: true }, orderBy: { role: 'asc' } },
      },
    });
    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.log('[MEMBER_ID_DELETE]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
};
