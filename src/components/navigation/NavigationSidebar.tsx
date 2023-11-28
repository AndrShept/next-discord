import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';
import React from 'react';
import { NavigationAction } from './NavigationAction';
import { Separator } from '../ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationItem } from './NavigationItem';
import { ModeToggle } from '../ModeToggle';
import { UserButton } from '@clerk/nextjs';

export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
   return null
  }
  const servers = await prisma.server.findMany({
    where: { members: { some: { profileId: profile.id } } },
    include: {channels: true}
  });
  return (
    <div className=' space-y-4 flex flex-col items-center h-full text-primary w-full bg-secondary/30 py-3'>
      <NavigationAction />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full '>
        {servers.map((server) => (
          <div  key={server.id}>
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
              channels= {server.channels}
            />
          </div>
        ))}
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: { avatarBox: 'h-[48px] w-[48px]' },
          }}
        />
      </div>
    </div>
  );
};
