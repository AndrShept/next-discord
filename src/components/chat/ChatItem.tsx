import React, { useEffect, useState } from 'react';
import { MessageWithMemberWithProfile } from './ChatMessages';
import { Member, MemberRole, Profile } from '@prisma/client';
import { UserAvatar } from '../UserAvatar';
import { ActionTooltip } from '../ActionTooltip';
import { roleIconMap } from '../server/ServerSidebar';
import Image from 'next/image';
import { Check, Edit, FileIcon, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { url } from 'inspector';
import { useModal } from '@/hooks/use-modal-store';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string | null>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: content,
    },
    resolver: zodResolver(formSchema),
  });
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();

  const fileType = fileUrl?.split('.').pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  let messageId = id
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`${socketUrl}/${messageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...socketQuery, ...values, messageId }),
      });
      if (res.ok) {
        setIsEditing(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onDelete =  () => {
   
      onOpen('deleteMessage', { apiUrl: `${socketUrl}/${messageId}` , query: socketQuery})
      // const res = await fetch(`${socketUrl}/${id}`, {
      //   method: 'DELETE',
      //   body: JSON.stringify({ ...socketQuery, id }),
      // });
      // if (res.ok) {


  };

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({ content: content });
  }, [content, form]);
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className='relative group flex items-center hover:bg-secondary/50 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div className='cursor-pointer hover:drop-shadow-md transition'>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex flex-col w-full ml-1'>
          <div className='flex items-center'>
            <div className='flex items-center'>
              <p className='font-semibold text-sm hover:underline cursor-pointer'>
                {member.profile.name}
              </p>
              <div className='ml-1'>
                <ActionTooltip label={member.role}>
                  {roleIconMap[member.role]}
                </ActionTooltip>
              </div>
              <span className='text-xs text-muted-foreground'>{timestamp}</span>
            </div>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
            >
              <Image className='object-cover' src={fileUrl} alt='image' fill />
            </a>
          )}
          {isPDF && (
            <div className='relative flex items-center py-4 px-2 mt-2 rounded-md bg-secondary/20 cursor-pointer'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
              >
                {fileUrl}
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                `break-all text-sm text-muted-foreground`,
                deleted && 'italic text-muted text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className='text-[10px] mx-2 text-muted-foreground '>
                  (edited)
                </span>
              )}
            </p>
          )}
          {isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-2'
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className='mt-2 focus-visible:ring-0 focus-visible:ring-offset-0'
                          placeholder='Edited message'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Press escape to cancel</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='space-x-1 pt-2'>
                  <ActionTooltip label='Save'>
                    <Button
                      disabled={isLoading}
                      size={'icon'}
                      className='rounded-full h-7 w-7  '
                      type='submit'
                    >
                      <Check className='' size={20} />
                    </Button>
                  </ActionTooltip>

                  <ActionTooltip label='Cancel'>
                    <Button
                      disabled={isLoading}
                      onClick={() => setIsEditing(false)}
                      size={'icon'}
                      className='rounded-full h-7 w-7'
                      type='reset'
                    >
                      <X size={20} />
                    </Button>
                  </ActionTooltip>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden bg-background group-hover:flex items-center gap-x-2 absolute p-1 top-1 right-5 border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing((prev) => !prev)}
                className='cursor-pointer w-4 h-4 ml-auto text-muted-foreground dark:hover:text-white hover:text-black transition'
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='Delete'>
            <Trash2
              onClick={onDelete }
              className='cursor-pointer w-4 h-4 ml-auto text-muted-foreground dark:hover:text-white hover:text-black   transition'
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
