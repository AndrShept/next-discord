
import { prisma } from '@/lib/db/prisma';
import { initialProfile } from '@/lib/initial-profile';

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
  if (!profile) {
    return redirect('/sign-in');
  }


  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'></main>
  );
}
