'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/works', label: 'Works' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/texts', label: 'Texts' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      setIsAnimating(true);
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Delay removing the component to allow exit animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isOpen ? 'auto' : 'none',
        zIndex: 50,
        overflow: 'hidden'
      }}
    >
      {/* Top Left - Logo */}
      <div
        style={{
          position: 'fixed',
          top: '32px',
          left: '32px',
          zIndex: 60
        }}
      >
        <Link
          href="/"
          onClick={onClose}
          aria-label="Home"
          style={{
            display: 'block',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Image
            src="/images/DL–favicon-circ.png"
            alt="Dominik Lejman"
            width={48}
            height={48}
            priority
          />
        </Link>
      </div>

      {/* Centered Navigation Links with upward entrance animations */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        padding: '0 20px'
      }}>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {menuItems.map((item, index) => (
            <li
              key={item.href}
              style={{
                listStyle: 'none',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.6s ease ${index * 0.1 + 0.1}s, transform 0.6s ease ${index * 0.1 + 0.1}s`,
                textAlign: 'center'
              }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  color: '#000000',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                  fontSize: 'clamp(1.68rem, 4.48vw, 3.36rem)',
                  lineHeight: '1.2',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language Switcher with entrance animation and transparent buttons */}
        <div
          style={{
            marginTop: '60px',
            display: 'flex',
            gap: '16px',
            fontSize: '14px',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s'
          }}
        >
          <button
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#000000',
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              transition: 'opacity 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            EN
          </button>
          <span style={{ color: '#999999' }}>|</span>
          <button
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#999999',
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              transition: 'color 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#999999'}
          >
            PL
          </button>
        </div>
      </nav>
    </div>
  );
}
