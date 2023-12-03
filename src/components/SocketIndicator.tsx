'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { useSocket } from './providers/SocketProvider';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { RefreshCcw } from 'lucide-react';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  const [isPending, setIsPending] = useState<boolean | undefined>(false);
  const { isSignedIn } = useAuth();
  useEffect(() => {
    setIsPending(isSignedIn);
  }, [isSignedIn]);
  return (
    <Badge
      variant={'outline'}
      className={cn('  text-white  border-none', {
        'bg-emerald-600': isConnected,
        'bg-yellow-600': !isConnected,
      })}
    >
      {isConnected ? 'Live: Real-time updates' : 'Fallback : Polling every 1s'}
      {!isPending && <RefreshCcw className='ml-1 animate-spin h-4 w-4' />}
    </Badge>
  );
};
