'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-12 lg:right-24 text-3xl text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded p-2"
        aria-label="Close navigation menu"
      >
        ✕
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col items-center justify-center min-h-screen px-6">
        <ul className="space-y-8 md:space-y-10 text-center">
          <li>
            <Link
              href="/"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              River
            </Link>
          </li>
          <li>
            <Link
              href="/works"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              Works
            </Link>
          </li>
          <li>
            <Link
              href="/exhibitions"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              Exhibitions
            </Link>
          </li>
          <li>
            <Link
              href="/biography"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              Biography
            </Link>
          </li>
          <li>
            <Link
              href="/timeline"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              Timeline
            </Link>
          </li>
          <li>
            <Link
              href="/texts"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              Texts
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              onClick={onClose}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-black hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-4 rounded"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Language Switcher */}
        <div className="mt-16 flex gap-4 text-sm font-body">
          <button className="text-black font-semibold underline focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded px-2 py-1">
            EN
          </button>
          <button className="text-mid-gray hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded px-2 py-1">
            DE
          </button>
          <button className="text-mid-gray hover:text-dark-gray transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded px-2 py-1">
            PL
          </button>
        </div>

        {/* Gallery Credit */}
        <div className="mt-8 font-body text-sm text-mid-gray">
          <span>Represented by </span>
          <a
            href="https://molskigallery.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-dark-gray underline transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 rounded"
          >
            Molski Gallery
          </a>
        </div>
      </nav>
    </div>
  );
}
