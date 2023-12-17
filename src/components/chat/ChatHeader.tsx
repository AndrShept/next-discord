import { Hash, Menu } from 'lucide-react';
import React from 'react';
import { MobileToggle } from '../MobileToggle';
import { UserAvatar } from '../UserAvatar';
import { SocketIndicator } from '../SocketIndicator';
import { ChatVideoButton } from './ChatVideoButton';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className='text-md font-semibold p-4 flex items-center h-14 border-b-2 '>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && <Hash className=' w-5 h-5 mr-2' />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl!} className=' w-8 h-8 mr-2' />
      )}
      <p className='font-semibold text-md '>{name}</p>

      <div className='ml-auto flex items-center'>
      {type === 'conversation' &&  <ChatVideoButton/>}
        <SocketIndicator />
      </div>
    </div>
  );
};
