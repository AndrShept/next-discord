'use client';
import { Member } from '@prisma/client';
import React from 'react';
import { ChatWelcome } from './ChatWelcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';

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
    <div className=' flex flex-1 flex-col py-4 overflow-y-auto'>
      <div className='flex-1' />
      <ChatWelcome type={type} name={name} />
    </div>
  );
};
