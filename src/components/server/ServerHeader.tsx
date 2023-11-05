'use client';
import { ServerWithMembers, ServerWithMembersWithProfile } from '@/lib/types/types';
import { MemberRole } from '@prisma/client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface ServerHeaderProps {
  server: ServerWithMembers;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  console.log(isModerator)
  return (
    <div>
      <DropdownMenu  >
        <DropdownMenuTrigger asChild className='focus:outline-none'>
          <button className='w-full text-sm font-semibold px-3 flex items-center h-12 border'>
            {server.name}
            <ChevronDown className='h-5 w-5 ml-auto' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-sm font-medium'>

            {isModerator && 
              <DropdownMenuItem>Profile</DropdownMenuItem>

            }
        
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
