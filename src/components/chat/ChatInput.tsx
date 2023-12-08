'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
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
import { Plus, Smile } from 'lucide-react';

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
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: '',
      fileUrl: ''
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({...query, ...values}),
      });
    } catch (error) {}
  };
  return (
    <div className=' '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Username</FormLabel> */}
                <FormControl>
                  <div className=' relative p-4 pb-6'>
                    <Button
                      type='button'
                      disabled={isLoading}
                      className='rounded-full absolute top-[29px] left-8 h-[24px] w-[24px] p-1'
                      size={'icon'}
                    >
                      <Plus />
                    </Button>
                    <Input
                      className='px-14 py-6 focus-visible:ring-0 bg-secondary/50 border-0 '
                      placeholder={`Message ${
                        type === 'conversation' ? name : '#' + name
                      }`}
                      {...field}
                    />

                    <Button
                      type='button'
                      disabled={isLoading}
                      className='absolute top-[29px] right-8  rounded-full   h-[24px] w-[24px] p-1'
                      size={'icon'}
                    >
                      <Smile />
                    </Button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
