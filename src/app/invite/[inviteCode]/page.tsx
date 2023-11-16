import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }: { params: { inviteCode: string } }) => {
  const profile = await currentProfile();
  if (!profile) {
    return null;
  }

  if (!params.inviteCode) {
    return redirect('/');
  }

  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: { some: { profileId: profile.id } },
    },
  });
  if (existingServer) {
    return redirect(`/server/${existingServer.id}`);
  }

  const server = await prisma.server.update({
    where: { inviteCode: params.inviteCode },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }
  return null
};

export default page;
