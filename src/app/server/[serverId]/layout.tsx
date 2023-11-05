import { ServerSidebar } from '@/components/server/ServerSidebar';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const layout = async ({
  params,
  children,
}: {
  params: { serverId: string };
  children: ReactNode;
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  const server = await prisma.server.findFirst({
    where: { id: params.serverId, member: { some: { profileId: profile.id } } },
  });

  if (!server) {
    return redirect('/');
  }
  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed border py-4 px-2 bg-secondary/20'>
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-[248px] px-2'>{children}</main>
    </div>
  );
};

export default layout;
