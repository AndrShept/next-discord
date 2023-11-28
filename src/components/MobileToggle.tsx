import { Menu } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NavigationSidebar } from './navigation/NavigationSidebar';
import { ServerSidebar } from './server/ServerSidebar';
import { useModal } from '@/hooks/use-modal-store';

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='md:hidden' variant={'ghost'} size={'icon'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className='flex p-0 gap-0 w-[350px] md:hidden'
      >
        <div>
          <NavigationSidebar />
        </div>
        <div className='p-2'>
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
