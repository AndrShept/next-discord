import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='min-h-full flex items-center justify-center'>
      {children}
    </div>
  );
};

export default layout;
