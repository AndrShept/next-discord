import { ModeToggle } from '@/components/ModeToggle';
import { InitialModal } from '@/components/modal/initial-modal';
import { prisma } from '@/lib/db/prisma';
import { initialProfile } from '@/lib/initial-profile';
import { UserButton } from '@clerk/nextjs';
import { Profile } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Home() {
  const profile: Profile = await initialProfile();
  const server = await prisma.server.findFirst({
    where: { member: { some: { profileId: profile.id } } },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <InitialModal />
      <ModeToggle />
      <UserButton afterSignOutUrl='/' />
    </main>
  );
}
