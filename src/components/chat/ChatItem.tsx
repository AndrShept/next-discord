import React, { useState } from 'react';
import { MessageWithMemberWithProfile } from './ChatMessages';
import { Member, MemberRole, Profile } from '@prisma/client';
import { UserAvatar } from '../UserAvatar';
import { ActionTooltip } from '../ActionTooltip';
import { roleIconMap } from '../server/ServerSidebar';
import Image from 'next/image';
import { Edit, FileIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { space } from 'postcss/lib/list';
import { Input } from '../ui/input';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string | null>;
}

export const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newContent, setNewContent] = useState(content);

  const fileType = fileUrl?.split('.').pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className='relative group flex items-center hover:bg-secondary/50 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div className='cursor-pointer hover:drop-shadow-md transition'>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center'>
            <div className='flex items-center'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {member.profile.name}
              </p>
              <div className='ml-1'>
                <ActionTooltip label={member.role}>
                  {roleIconMap[member.role]}
                </ActionTooltip>
              </div>
              <span className='text-xs text-muted-foreground'>{timestamp}</span>
            </div>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
            >
              <Image className='object-cover' src={fileUrl} alt='image' fill />
            </a>
          )}
          {isPDF && (
            <div className='relative flex items-center py-4 px-2 mt-2 rounded-md bg-secondary/20 cursor-pointer'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
              >
                {fileUrl}
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                `break-all text-sm text-muted-foreground`,
                deleted && 'italic text-muted text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className='text-[10px] mx-2 bg-muted-foreground '>
                  (edited)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden bg-background group-hover:flex items-center gap-x-2 absolute p-1 top-1 right-5 border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing((prev) => !prev)}
                className='cursor-pointer w-4 h-4 ml-auto text-muted-foreground dark:hover:text-white hover:text-black transition'
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='Delete'>
            <Trash2 className='cursor-pointer w-4 h-4 ml-auto text-rose-500 hover:text-rose-400  transition' />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
