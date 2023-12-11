'use client';
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { FileUpload } from '../FileUpload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

const formScheme = z.object({
  fileUrl: z.string().min(1, { message: 'File is required' }),
});

export const MessageFileModal = () => {
  const router = useRouter();
  const { data, isOpen, onClose, type } = useModal();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === 'messageFile';
  const form = useForm<z.infer<typeof formScheme>>({
    defaultValues: {
      fileUrl: '',
    },
    resolver: zodResolver(formScheme),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    try {
      const res = await fetch(apiUrl as string, {
        method: 'POST',
        body: JSON.stringify({...values,  ...query, content: values.fileUrl }),
      });
      if (res.ok) {
        form.reset();
        handleClose()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset;
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an attachment</DialogTitle>
          <DialogDescription>Send a file as a message</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='fileUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='messageFile'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={isLoading} variant={'primary'} type='submit'>
                SEND
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
