'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content - Add top padding to account for fixed header */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      <Footer />
    </>
  );
}
