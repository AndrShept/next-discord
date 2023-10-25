'use client';
import { UploadButton, UploadDropzone, Uploader } from '@/lib/uploadthing';
import React from 'react';
import '@uploadthing/react/styles.css';
import { Button } from './ui/button';
import { UploadFileResponse } from 'uploadthing/client';

interface FileUploadProps {
  value: string
  endpoint: 'messageFile' | 'serverImage';
  onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  return (
    <div>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
          console.log(value)
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
};
