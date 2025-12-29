'use client';

import { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header onMenuClick={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} onMenuClose={() => setIsMenuOpen(false)} />
      <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content - Top padding to account for fixed header */}
      <main style={{
        paddingTop: '120px',
        flex: '1',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
