import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import IntroOverlay from "@/components/IntroOverlay";
import { getIntroVideo } from "@/lib/sanity/riverVideos";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const introVideo = await getIntroVideo();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://dlejman.com/#person",
              "name": "Dominik Lejman",
              "url": "https://dlejman.com/",
              "sameAs": [
                "https://pl.wikipedia.org/wiki/Dominik_Lejman",
                "https://www.wikidata.org/wiki/Q9209785",
                "https://www.personsprojects.com/artists/dominik-lejman",
                "https://www.artsy.net/artist/dominik-lejman",
                "https://www.e-flux.com/announcements/6785463/dominik-lejmanphantoms",
                "https://molskigallery.com/artysci/dominik-lejman",
                "https://www.instagram.com/dominik.m.lejman/"
              ],
              "jobTitle": "Contemporary Artist",
              "description": "Dominik Lejman is a contemporary Polish artist known for hybrid paintings combining traditional painting with video projection and moving image.",
              "nationality": {
                "@type": "Country",
                "name": "Poland"
              },
              "knowsAbout": [
                "contemporary art",
                "hybrid painting",
                "video art",
                "video projection",
                "painting",
                "installation art"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://dlejman.com/#website",
              "url": "https://dlejman.com/",
              "name": "Dominik Lejman — Official Website",
              "publisher": {
                "@id": "https://dlejman.com/#person"
              },
              "inLanguage": "en"
            })
          }}
        />
      </head>
      <body>
        <IntroOverlay video={introVideo}>
          <Layout>{children}</Layout>
        </IntroOverlay>
      </body>
    </html>
  );
}
