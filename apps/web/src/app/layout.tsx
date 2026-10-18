import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Italiana, Jost } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';

const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-italiana',
});

const jost = Jost({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
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
        url: '/products/serum-lumiere/1.svg',
        width: 1600,
        height: 2000,
        alt: 'Sérum Lumière by zayneessence',
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
    { media: '(prefers-color-scheme: light)', color: '#F6F3F7' },
    { media: '(prefers-color-scheme: dark)', color: '#170C1B' },
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
    <html lang="en" className={`${italiana.variable} ${jost.variable}`}>
      <body>
        <AppShell modal={modal}>{children}</AppShell>
      </body>
    </html>
  );
}
