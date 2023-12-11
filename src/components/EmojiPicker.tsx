'use client';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from 'next-themes';

interface EmojiPickerProps {
  onChange: (emoji:string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { theme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile />
      </PopoverTrigger>
      <PopoverContent
        className='bg-transparent border-none shadow-none drop-shadow-none mb-16'
        side='right'
        sideOffset={40}
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji:any)=> onChange(emoji.native )}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </PopoverContent>
    </Popover>
  );
};
