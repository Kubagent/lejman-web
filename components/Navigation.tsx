'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWrittenWorks } from '@/lib/sanity/writtenWorks';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/works', label: 'Works', checkContent: false },
  { href: '/projects', label: 'Projects', checkContent: false },
  { href: '/written-work', label: 'Writings', checkContent: true },
  { href: '/about', label: 'About', checkContent: false },
  { href: '/contact', label: 'Contact', checkContent: false },
];

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSoonFor, setShowSoonFor] = useState<string | null>(null);
  const [hasWrittenWorks, setHasWrittenWorks] = useState<boolean>(false);

  // Check for written works content
  useEffect(() => {
    async function checkContent() {
      try {
        const writtenWorks = await getWrittenWorks();
        setHasWrittenWorks(writtenWorks.length > 0);
      } catch (error) {
        console.error('Failed to check written works:', error);
        setHasWrittenWorks(false);
      }
    }
    checkContent();
  }, []);

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

  // Check if a menu item has content
  const hasContent = (item: typeof menuItems[0]): boolean => {
    if (!item.checkContent) return true;
    if (item.href === '/written-work') return hasWrittenWorks;
    return true;
  };

  // Handle menu item click
  const handleMenuClick = (e: React.MouseEvent, item: typeof menuItems[0]) => {
    if (!hasContent(item)) {
      e.preventDefault();
      setShowSoonFor(item.href);
      setTimeout(() => setShowSoonFor(null), 3000);
    } else {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      <style jsx>{`
        @keyframes soonAppear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(5px);
          }
          40% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          60% {
            transform: scale(0.98) translateY(0);
          }
          80% {
            transform: scale(1.02) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

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
          backgroundColor: '#FFFFFF',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 50,
          overflow: 'hidden'
        }}
      >
      {/* Top Left - Logo (center-aligned with hamburger button) */}
      <div
        className="nav-logo"
        style={{
          position: 'fixed',
          top: '22px',
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
            src="/images/bio/dl_logo.png"
            alt="Dominik Lejman"
            width={120}
            height={80}
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
        minHeight: '100%',
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
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <Link
                href={item.href}
                onClick={(e) => handleMenuClick(e, item)}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  color: '#000000',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                  fontSize: 'clamp(1.68rem, 4.48vw, 3.36rem)',
                  lineHeight: '1.2',
                  display: 'inline-block',
                  cursor: hasContent(item) ? 'pointer' : 'not-allowed',
                  opacity: hasContent(item) ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (hasContent(item)) {
                    e.currentTarget.style.opacity = '0.7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasContent(item)) {
                    e.currentTarget.style.opacity = '1';
                  } else {
                    e.currentTarget.style.opacity = '0.6';
                  }
                }}
              >
                {item.label}
              </Link>

              {/* "soon." message to the right of menu item */}
              {showSoonFor === item.href && (
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#000000',
                    animation: 'soonAppear 0.8s ease-out forwards',
                    whiteSpace: 'nowrap'
                  }}
                  role="status"
                  aria-live="polite"
                >
                  soon.
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Language Switcher - Hidden until translations are implemented */}
        {/* TODO: Re-enable when website translations are ready */}
        {/* <div
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
        </div> */}
      </nav>
    </div>
    </>
  );
}
