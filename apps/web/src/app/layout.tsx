import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Italiana, Plus_Jakarta_Sans } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';

const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-italiana',
});

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://zayneessence.com'
  ),
  title: {
    default: 'zayneessence — Skincare, pure oud oils and perfume',
    template: '%s · zayneessence',
  },
  description:
    'Skincare made with Nigerian shea, baobab and moringa for melanin-rich skin, alongside pure oud oils and perfume.',
  applicationName: 'zayneessence',
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'zayneessence',
    title: 'zayneessence — Skin that glows, quietly',
    description:
      'Skincare made with Nigerian shea, baobab and moringa for melanin-rich skin, alongside pure oud oils and perfume.',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1000,
        height: 1504,
        alt: 'zayneessence: skincare, pure oud oils and perfume for melanin-rich skin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'zayneessence — Skin that glows, quietly',
    description:
      'Skincare made with Nigerian shea, baobab and moringa for melanin-rich skin, alongside pure oud oils and perfume.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6EAF3' },
    { media: '(prefers-color-scheme: dark)', color: '#150C14' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${italiana.variable} ${jakarta.variable}`}>
      <body>
        <AppShell modal={modal}>{children}</AppShell>
      </body>
    </html>
  );
}
