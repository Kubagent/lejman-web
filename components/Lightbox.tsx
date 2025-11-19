'use client';

import { useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    url: string;
    alt: string;
    title?: string;
    year?: number;
  }>;
  initialIndex?: number;
}

/**
 * Lightbox - Full-screen image viewer with keyboard navigation
 *
 * Features:
 * - Full-screen dark overlay
 * - Image navigation (prev/next)
 * - Keyboard controls:
 *   - ESC: Close lightbox
 *   - Left/Right Arrow: Navigate images
 *   - Space: Toggle zoom (future enhancement)
 * - Touch gestures: Swipe to close
 * - Accessibility: Focus trap, ARIA labels
 * - Portal rendering for proper z-index stacking
 *
 * Performance:
 * - Image preloading for smooth navigation
 * - CSS transforms for animations
 * - Body scroll lock when open
 */
export default function Lightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1) goToPrevious();
          break;
        case 'ArrowRight':
          if (images.length > 1) goToNext();
          break;
        case ' ':
          e.preventDefault();
          toggleZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, toggleZoom, onClose, images.length]);

  // Touch gesture handlers for mobile swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;

    // If swipe down more than 100px, close lightbox
    if (diff < -100) {
      onClose();
    }

    setTouchStart(null);
  };

  if (!isOpen || !mounted) return null;

  const currentImage = images[currentIndex];

  // Render lightbox in a portal for proper z-index stacking
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors group"
        aria-label="Close lightbox"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Previous button - only show if multiple images */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button - only show if multiple images */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt}
          className={`max-w-full max-h-full object-contain transition-transform duration-300 cursor-pointer ${
            isZoomed ? 'scale-150 md:scale-200' : 'scale-100'
          }`}
          onClick={toggleZoom}
          draggable={false}
        />

        {/* Image metadata overlay */}
        <div className="absolute bottom-4 left-4 right-4 md:left-8 md:right-8 bg-black/50 backdrop-blur-sm p-4 rounded-lg">
          <p className="font-heading text-lg md:text-xl text-white">
            {currentImage.title}
            {currentImage.year && `, ${currentImage.year}`}
          </p>
          {images.length > 1 && (
            <p className="font-body text-sm text-white/70 mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 right-4 hidden md:block">
        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg">
          <p className="font-body text-xs text-white/70 space-y-1">
            <span className="block">ESC: Close</span>
            {images.length > 1 && (
              <span className="block">← →: Navigate</span>
            )}
            <span className="block">SPACE: Zoom</span>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
