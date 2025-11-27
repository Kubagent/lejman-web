'use client';

import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  onMenuClose: () => void;
}

export default function Header({ onMenuClick, isMenuOpen, onMenuClose }: HeaderProps) {
  return (
    <>
      {/* Top Left - Artist Name/Logo */}
      <div
        style={{
          position: 'fixed',
          top: '32px',
          left: '72px',
          zIndex: 40
        }}
      >
        <Link
          href="/"
          className="text-xl md:text-2xl font-semibold text-black hover:text-dark-gray transition-colors underline decoration-1 underline-offset-4"
          aria-label="Home"
          style={{
            display: 'block',
            lineHeight: '1.2',
            fontFamily: 'Cormorant Garamond, serif'
          }}
        >
          Dominik<br />Lejman
        </Link>
      </div>

      {/* Top Right - Animated Menu Button (hamburger/cross) */}
      <div
        style={{
          position: 'fixed',
          top: '32px',
          right: '72px',
          zIndex: isMenuOpen ? 60 : 40
        }}
      >
        <button
          onClick={isMenuOpen ? onMenuClose : onMenuClick}
          className="group relative flex items-center justify-center hover:opacity-70 focus:outline-none"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <span style={{ position: 'relative', width: '28px', height: '18px', display: 'block' }}>
            {/* Top line - rotates to form top part of X */}
            <span style={{
              position: 'absolute',
              height: '2px',
              width: '28px',
              backgroundColor: '#000000',
              display: 'block',
              top: isMenuOpen ? '8px' : '0px',
              left: '0',
              transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'all 0.5s ease'
            }}></span>
            {/* Middle line - fades out */}
            <span style={{
              position: 'absolute',
              height: '2px',
              width: '28px',
              backgroundColor: '#000000',
              display: 'block',
              top: '8px',
              left: '0',
              opacity: isMenuOpen ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}></span>
            {/* Bottom line - rotates to form bottom part of X */}
            <span style={{
              position: 'absolute',
              height: '2px',
              width: '28px',
              backgroundColor: '#000000',
              display: 'block',
              top: isMenuOpen ? '8px' : '16px',
              left: '0',
              transform: isMenuOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
              transition: 'all 0.5s ease'
            }}></span>
          </span>
        </button>
      </div>
    </>
  );
}
