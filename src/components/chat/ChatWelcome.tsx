import { Hash } from 'lucide-react';
import React from 'react';

interface ChatWelcomeProps {
  type: 'channel' | 'conversation';
  name: string;
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 p-4   '>
      {type === 'channel' && (
        <div className='h-[75px] w-[75px] p-1 bg-secondary/50 rounded-full flex items-center justify-center'>
          <Hash className='w-12 h-12 ' />
        </div>
      )}
      <p className='text-xl md:text-3xl font-bold'>
        {type === 'channel' ? 'Welcome to #' : ''}
        {name}
      </p>
      <p className='text-sm text-muted-foreground'>
        {type === 'channel'
          ? `This is the start of the #${name} channel`
          : `This is the start of your conversation with ${name} `}
      </p>
    </div>
  );
};
