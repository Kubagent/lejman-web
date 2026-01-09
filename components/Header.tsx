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
      {/* Top Left - Artist Name/Logo - 150% larger with visibility enhancement */}
      <div
        className="header-logo"
        style={{
          position: 'fixed',
          top: '32px',
          zIndex: 40
        }}
      >
        <Link
          href="/"
          className="font-semibold text-black"
          aria-label="Home"
          style={{
            display: 'block',
            lineHeight: '1.2',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(1.47rem, 3.5vw, 2.52rem)',
            fontWeight: 600,
            textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)',
            textDecoration: 'none'
          }}
        >
          Dominik Lejman
        </Link>
      </div>

      {/* Top Right - Animated Menu Button (hamburger/cross) - 150% larger with visibility enhancement */}
      <div
        className="header-menu"
        style={{
          position: 'fixed',
          top: '32px',
          zIndex: isMenuOpen ? 60 : 40
        }}
      >
        <button
          onClick={isMenuOpen ? onMenuClose : onMenuClick}
          className="group relative flex items-center justify-center hover:opacity-70 focus:outline-none"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <span style={{ position: 'relative', width: '42px', height: '27px', display: 'block' }}>
            {/* Top line - rotates to form top part of X */}
            <span style={{
              position: 'absolute',
              height: '3px',
              width: '42px',
              backgroundColor: '#000000',
              display: 'block',
              top: isMenuOpen ? '12px' : '0px',
              left: '0',
              transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'all 0.5s ease',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)'
            }}></span>
            {/* Middle line - fades out */}
            <span style={{
              position: 'absolute',
              height: '3px',
              width: '42px',
              backgroundColor: '#000000',
              display: 'block',
              top: '12px',
              left: '0',
              opacity: isMenuOpen ? 0 : 1,
              transition: 'opacity 0.3s ease',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)'
            }}></span>
            {/* Bottom line - rotates to form bottom part of X */}
            <span style={{
              position: 'absolute',
              height: '3px',
              width: '42px',
              backgroundColor: '#000000',
              display: 'block',
              top: isMenuOpen ? '12px' : '24px',
              left: '0',
              transform: isMenuOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
              transition: 'all 0.5s ease',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6)'
            }}></span>
          </span>
        </button>
      </div>
    </>
  );
}
