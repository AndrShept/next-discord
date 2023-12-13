'use client';
import { Member, Message, Profile } from '@prisma/client';
import React, { Fragment } from 'react';
import { ChatWelcome } from './ChatWelcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import { ChatItem } from './ChatItem';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketQuery: Record<string, string | null>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
  socketUrl: string;
}

export interface MessageWithMemberWithProfile extends Message {
  member: Member & { profile: Profile };
}

export const ChatMessages = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesProps) => {
  const DATE_FORMAT = 'd MMM yyyy, HH:mm';
  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  if (status === 'loading') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 animate-spin my-4' />
        <p className='text-xs'>Loading message...</p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7  my-4 animate-pulse' />
        <p className='text-xs'>Something went wrong!</p>
      </div>
    );
  }
  return (
    <div className=' flex   flex-col  py-4 '>
      <ChatWelcome type={type} name={name} />
      <Separator />
      <div className='flex flex-1  flex-col-reverse mt-auto'>
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.createdAt !== message.updatedAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
