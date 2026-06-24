import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from './providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Darpan | CP Performance Tracker',
  description:
    'Track competitive programming performance across Codeforces, LeetCode, and CodeChef. Monitor training camps, analyze contest standings, and compare with friends.',
  keywords: [
    'competitive programming',
    'codeforces',
    'leetcode',
    'codechef',
    'cp tracker',
    'performance tracker',
    'training camp',
    'darpan',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen transition-colors duration-300`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
