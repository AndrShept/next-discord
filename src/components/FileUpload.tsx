'use client';
import { UploadDropzone } from '@/lib/uploadthing';
import React from 'react';
import '@uploadthing/react/styles.css';
import { Button } from './ui/button';
import Image from 'next/image';
import { X } from 'lucide-react';

interface FileUploadProps {
  value: string;
  endpoint: 'messageFile' | 'serverImage';
  onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20 mt-4'>
        <Image fill src={value} alt={'Upload'} className='rounded-full' />
        <button onClick={()=> onChange('')} className='absolute rounded-full transition hover:bg-red-600 -top-2 -right-1 p-[2px] bg-red-500 text-white '>
          <X />
        </button>
      </div>
    );
  }
  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
};
