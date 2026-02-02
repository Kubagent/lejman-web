'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  onMenuClose: () => void;
}

export default function Header({ onMenuClick, isMenuOpen, onMenuClose }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollAccumulator = useRef(0);
  const ticking = useRef(false);

  // Scroll threshold before triggering hide/show (prevents jitter)
  const SCROLL_THRESHOLD = 15;

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - lastScrollY.current;

          // Always show header at the top of the page
          if (currentScrollY < 100) {
            setIsVisible(true);
            scrollAccumulator.current = 0;
          } else {
            // Accumulate scroll in the current direction
            if ((scrollDelta > 0 && scrollAccumulator.current > 0) ||
                (scrollDelta < 0 && scrollAccumulator.current < 0)) {
              // Same direction - accumulate
              scrollAccumulator.current += scrollDelta;
            } else {
              // Direction changed - reset accumulator
              scrollAccumulator.current = scrollDelta;
            }

            // Only trigger visibility change after threshold is exceeded
            if (scrollAccumulator.current > SCROLL_THRESHOLD) {
              // Scrolled down enough - hide header
              setIsVisible(false);
            } else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
              // Scrolled up enough - show header
              setIsVisible(true);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always show header when menu is open
  const shouldShow = isVisible || isMenuOpen;

  return (
    <>
      {/* Top Left - Artist Name/Logo - 150% larger with visibility enhancement */}
      <div
        className="header-logo"
        style={{
          position: 'fixed',
          top: '32px',
          zIndex: 40,
          transform: shouldShow ? 'translateY(0)' : 'translateY(-100px)',
          opacity: shouldShow ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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
          zIndex: isMenuOpen ? 60 : 40,
          transform: shouldShow ? 'translateY(0)' : 'translateY(-100px)',
          opacity: shouldShow ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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
