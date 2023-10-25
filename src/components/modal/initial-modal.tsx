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

const formScheme = z.object({
  name: z.string().min(1, { message: 'Sever name is required' }).max(20),
  imageUrl: z.string().min(1, { message: 'Server image is required' }),
});

export const InitialModal = () => {
  const form = useForm<z.infer<typeof formScheme>>({
    defaultValues: {
      name: '',
      imageUrl: '',
    },
    resolver: zodResolver(formScheme),
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formScheme>) => {
    console.log(values);
  };
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize your server</DialogTitle>
          <DialogDescription>
            Give your server a personality with a name and an image. You can
            always change it later
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
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
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='uppercase text-sm font-bold'>
                    Server name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='bg-secondary/80 border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                      disabled={isLoading}
                      placeholder='enter server name'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant={'primary'} type='submit'>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
