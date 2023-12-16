'use client';
import React, { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ActionTooltipProps {
  label: string;
  children?: ReactNode;
  side?: 'top' | 'right' | 'left' | 'bottom';
  align?: 'start' | 'center' | 'end';
  alignOffset?: number
}

export const ActionTooltip = ({
  label,
  children,
  side,
  align,
  alignOffset
}: ActionTooltipProps) => {
  return (
    <TooltipProvider >
      <Tooltip  delayDuration={50} >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} alignOffset={alignOffset}>
          <p className='font-semibold text-sm capitalize'>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
