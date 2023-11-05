import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { NavigationSidebar } from '@/components/navigation/NavigationSidebar';
import { CreateServerModal } from '@/components/modal/create-server-modal';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Team chat app',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem={false}
            disableTransitionOnChange
          >
            <CreateServerModal />
            <div className='h-full flex max-w-7xl mx-auto'>
              <div className='hidden md:flex h-full w-[72px] z-30 flex-col  fixed inset-y-0 '>
                <NavigationSidebar />
              </div>
              <main className='md:pl-[72px]  h-full w-full md:py-4 py-2 '>
                {' '}
           
           
                {children}
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
