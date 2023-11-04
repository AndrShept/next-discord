'use client';
import React from 'react';
import { ActionTooltip } from '../ActionTooltip';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip align='center' side='right' label={name}>
      <button
        onClick={() => router.push(`/server/${id}`)}
        className='group relative flex items-center mb-4'
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px] ',

            params.serverId !== id && 'group-hover:h-[20px]',
            params.serverId === id ? 'h-[36px]' : 'h-[8px] '
          )}
        >

        </div>
        <div
            className={cn(
              'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden ',
              params.serverId === id &&
                'bg-primary/10 text-primary rounded-[16px]'
            )}
          >
            <Image fill src={imageUrl} alt='Channel' />
          </div>
      </button>
    </ActionTooltip>
  );
};
