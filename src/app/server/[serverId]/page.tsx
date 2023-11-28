import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }
  const server = await prisma.server.findFirst({
    where: {
      id: params.serverId,
      members: { some: { profileId: profile.id } },
    },
    include: {
      channels: { where: { name: 'general' }, orderBy: { createdAt: 'asc' } },
    },
  });
  const initialChannel = server?.channels[0];
  return redirect(`/server/${server?.id}/channels/${initialChannel?.id}`);
};

export default page;
