import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

interface MemberIdPageProps {
  params: { serverId: string; memberId: string };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  const currentMember = await prisma.member.findFirst({
    where: { profileId: params.memberId, serverId: params.serverId },
  });

  return <div>{JSON.stringify(params.memberId)}</div>;
};

export default MemberIdPage;
