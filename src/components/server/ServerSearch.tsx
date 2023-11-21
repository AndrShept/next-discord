'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useParams, useRouter } from 'next/navigation';

interface ServerSearchProps {
  data: {
    label: string;
    type: 'channel' | 'member';
    data:
      | {
          icon: React.ReactNode;
          name: string | undefined;
          id: string;
        }[]
      | undefined;
  }[];
}
export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const [value, setValue] = useState('');

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: 'channel' | 'member';
  }) => {
    setOpen(false);
    if (type === 'member') {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
    if (type === 'channel') {
      return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={'ghost'}
        className='group text-muted-foreground w-full'
      >
        <Search className='mr-1 h-4 w-4  ' />
        <p>Search</p>
        <kbd className='pointer-events-none inline-flex h-5 select-none  items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className=''>⌘</span>
          <span className='text-base'>K</span>
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={value}
          onValueChange={setValue}
          placeholder='Search all channels and members'
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {data?.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
