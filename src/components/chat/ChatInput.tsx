'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ChevronsDown, Plus, Smile } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '../EmojiPicker';
import { useRouter } from 'next/navigation';
import { ActionTooltip } from '../ActionTooltip';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'channel';
}

const formSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.string(),
});

export const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: '',
      fileUrl: '',
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ ...query, ...values }),
      });
      if (res.ok) {
        form.reset();
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition((prev) => ({ ...prev, y: window.scrollY }));
    };
    setIsAtBottom(
      scrollPosition.y + window.innerHeight >= document.body.scrollHeight
    );
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition.y]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 sticky   bottom-0   '
      >

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <div className=' relative p-4 pb-6 bg-background'>
                  <ActionTooltip label='Add file'>
                    <Button
                      onClick={() => onOpen('messageFile', { apiUrl, query })}
                      type='button'
                      variant={'primary'}
                      disabled={isLoading}
                      className='rounded-full absolute top-[29px] left-8 h-[24px] w-[24px] p-1'
                      size={'icon'}
                    >
                      <Plus />
                    </Button>
                  </ActionTooltip>
                  <Input
                    className='px-14 py-6 focus-visible:ring-0 focus-visible:ring-offset-0 bg-secondary/50 border-0 '
                    placeholder={`Message: ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    {...field}
                  />

                  <Button
                    variant={'primary'}
                    type='button'
                    disabled={isLoading}
                    className='absolute top-[29px] right-8  rounded-full   h-[24px] w-[24px] p-1'
                    size={'icon'}
                  >
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </Button>
                  {!isAtBottom && (
          <Button
            type='button'
            variant={'primary'}
            onClick={() => window.scrollTo(0, document.body.scrollHeight)}
            className='absolute right-5 bottom-24   p-1    h-12 w-12 rounded-full transition opacity-60 hover:opacity-100 '
          >
            <ChevronsDown className=' ' />
          </Button>
        )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
