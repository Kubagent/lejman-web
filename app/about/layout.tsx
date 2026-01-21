import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Dominik Lejman, Polish visual artist known for video painting and time-based media. Biography, publications, press kit, interviews, and links.',
  openGraph: {
    title: 'About - Dominik Lejman',
    description: 'Biography and information about visual artist Dominik Lejman.',
    type: 'profile',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
