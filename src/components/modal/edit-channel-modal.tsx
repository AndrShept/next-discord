'use client';
import React, { ReactNode, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { Loader2 } from 'lucide-react';
import { ChannelType } from '@prisma/client';

const formScheme = z.object({
  name: z
    .string()
    .min(1, { message: 'Channel name is required' })
    .max(20)
    .refine((name) => name !== 'general', {
      message: 'Channel name cannot be "general"',
    }),
  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const params: { serverId: string } = useParams();
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { channelType, channel } = data;
  const isModalOpen = isOpen && type === 'editChannel';
  const form = useForm<z.infer<typeof formScheme>>({
    defaultValues: {
      name: '',
      type: channelType || ChannelType.TEXT,
    },
    resolver: zodResolver(formScheme),
  });
  const isLoading = form.formState.isSubmitting;
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    try {
      const res = await fetch(
        `/api/channels/${params.serverId}/${channel?.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(values),
        }
      );
      if (res.ok) {
        form.reset();
        router.refresh();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (channel) {
      form.setValue('type', channel.type);
      form.setValue('name', channel.name);
    }
  }, [channel, form]);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'></div>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-sm font-bold'>
                    Channel name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='bg-secondary/80 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                      disabled={isLoading}
                      placeholder='enter channel name'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-sm font-bold'>
                    Channel type
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={'Select a channel type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ChannelType.TEXT}>
                          {ChannelType.TEXT}
                        </SelectItem>
                        <SelectItem value={ChannelType.AUDIO}>
                          {ChannelType.AUDIO}
                        </SelectItem>
                        <SelectItem value={ChannelType.VIDEO}>
                          {ChannelType.VIDEO}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isLoading} variant={'primary'} type='submit'>
                <div className='flex items-center gap-2'>
                  <span>SAVE</span>
                  {isLoading && <Loader2 size={20} className='animate-spin' />}
                </div>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
