import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

const BASE_URL = 'https://dlejman.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Dominik Lejman | Visual Artist',
    template: '%s | Dominik Lejman',
  },
  description: 'Official portfolio of Dominik Lejman, Polish visual artist known for video painting, time-based media, and motion-integrated artwork. Exploring the intersection of painting, digital media, and architectural space.',
  keywords: [
    'Dominik Lejman',
    'visual artist',
    'video painting',
    'contemporary art',
    'Polish artist',
    'time-based media',
    'digital art',
    'motion art',
    'painting',
    'video art',
    'installation art',
  ],
  authors: [{ name: 'Dominik Lejman', url: 'https://dlejman.com' }],
  creator: 'Dominik Lejman',
  publisher: 'Dominik Lejman',
  other: {
    'instagram:creator': '@dominik.m.lejman',
  },
  icons: {
    icon: '/images/bio/dl_logo_s.png',
    apple: '/images/bio/dl_logo_s.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Dominik Lejman',
    title: 'Dominik Lejman | Visual Artist',
    description: 'Official portfolio of Dominik Lejman, Polish visual artist known for video painting, time-based media, and motion-integrated artwork.',
    images: [
      {
        url: '/images/bio/dl_logo.png',
        width: 500,
        height: 500,
        alt: 'Dominik Lejman',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dominik Lejman | Visual Artist',
    description: 'Official portfolio of Dominik Lejman, Polish visual artist known for video painting and time-based media.',
    images: ['/images/bio/dl_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
