import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskPilot & TaskStream | Task Management',
  description:
    'Manage assignments, track status in real-time, and supervise project delivery velocity.',
};

export const instant = false;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-blue-500/20 selection:text-blue-700 dark:selection:bg-blue-600/30 dark:selection:text-blue-300"
      >
        {children}
      </body>
    </html>
  );
}
