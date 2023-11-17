'use client';
import {
  ServerWithMembers,
  ServerWithMembersWithProfile,
} from '@/lib/types/types';
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
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash2,
  UserPlus,
  Users2,
} from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ServerHeaderProps {
  server: ServerWithMembers;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='focus:outline-none'>
          <button className='w-full rounded-md text-sm font-semibold px-3 flex items-center h-12 border'>
            {server.name}
            <ChevronDown className='h-5 w-5 ml-auto' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-sm font-medium text-muted-foreground'>
          {isModerator && (
            <DropdownMenuItem
              onClick={() => onOpen('invite', { server })}
              className='cursor-pointer text-green-600'
            >
              Invite People <UserPlus className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('editServer', {server})}
              className='cursor-pointer'
            >
              Server Settings <Settings className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem
              onClick={() => onOpen('members', {server})}
              className='cursor-pointer'
            >
              Manage Members <Users2 className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
          )}
          {isModerator && (
            <DropdownMenuItem onClick={()=> onOpen('createChannel')} className='cursor-pointer'>

              Create Channel <PlusCircle className='h-4 w-4 ml-auto' />
            </DropdownMenuItem>
          )}
          {isModerator && <DropdownMenuSeparator />}
          {isAdmin && (
            <DropdownMenuItem className='cursor-pointer text-rose-500'>
              Delete Server <Trash2 className='h-4 w-4 ml-auto ' />
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem className='cursor-pointer'>
              Leave Server <LogOut className='h-4 w-4 ml-auto ' />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
