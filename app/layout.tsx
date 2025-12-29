import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";

export const metadata: Metadata = {
  title: "Dominik L. - Artist Portfolio",
  description: "Professional digital portfolio for visual artist Dominik L., showcasing painting, digital media, and motion-based work.",
  icons: {
    icon: '/images/DL–favicon-circ.png',
    apple: '/images/DL–favicon-circ.png',
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
