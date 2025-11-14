'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { RiverVideoSlotProps } from '@/lib/types';
import { urlFor } from '@/lib/sanity/image';
import { getFileAssetUrl } from '@/lib/sanity/file';
import { useVideoIntersection } from '@/lib/hooks/useVideoIntersection';

/**
 * PlayPauseIcon - SVG icon component for play/pause overlay
 */
function PlayPauseIcon({ isPlaying }: { isPlaying: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-16 h-16 md:w-20 md:h-20"
      fill="currentColor"
      aria-hidden="true"
    >
      {isPlaying ? (
        // Pause icon - two vertical bars
        <>
          <rect x="14" y="12" width="6" height="24" rx="1" />
          <rect x="28" y="12" width="6" height="24" rx="1" />
        </>
      ) : (
        // Play icon - triangle
        <path d="M16 12 L16 36 L36 24 Z" />
      )}
    </svg>
  );
}

/**
 * RiverVideoSlot - Individual video slot in the river layout
 *
 * Features:
 * - HTML5 video with muted, loop, playsInline attributes
 * - High-performance scroll-triggered autoplay using Intersection Observer
 * - Mobile-optimized tap-to-play with visual feedback
 * - iOS Safari fullscreen prevention
 * - Touch-friendly 44x44px minimum touch targets
 * - Lazy loading with intelligent preload strategy
 * - Poster image for initial frame
 * - Responsive aspect ratio container
 * - Video metadata overlay (title, year)
 * - Respects prefers-reduced-motion
 *
 * Performance Optimizations:
 * - 50% threshold for play, 20% threshold for pause
 * - 100px rootMargin for preloading before viewport
 * - RAF-throttled play/pause calls
 * - Automatic cleanup on unmount
 * - Network-aware preload strategy (metadata → auto)
 *
 * Mobile Optimizations:
 * - Touch event handling with proper preventDefault
 * - Debounced tap handling (300ms) to prevent double-tap zoom
 * - Visual feedback overlay with fade animations
 * - Coordinates with scroll-triggered autoplay
 * - iOS Safari compatibility (playsInline, no fullscreen)
 */
export default function RiverVideoSlot({
  video,
  locale = 'en',
  isInView: isInViewProp = false
}: RiverVideoSlotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile interaction state
  const [showPlayPauseOverlay, setShowPlayPauseOverlay] = useState(false);
  const [overlayIcon, setOverlayIcon] = useState<'play' | 'pause'>('play');
  const lastTapTimeRef = useRef<number>(0);
  const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Playback status for screen readers
  const [playbackStatus, setPlaybackStatus] = useState<'playing' | 'paused' | 'loading'>('paused');
  const [videoError, setVideoError] = useState(false);

  // High-performance intersection observer hook
  const { isInView, isPlaying, intersectionRatio, isReady, play, pause } = useVideoIntersection(
    videoRef,
    {
      playThreshold: 0.5,      // Start playing at 50% visible
      pauseThreshold: 0.2,     // Pause at 20% visible
      rootMargin: '100px 0px', // Preload 100px before entering viewport
      debug: false,            // Enable for development debugging
      respectManualPause: true, // Don't override user interactions
    }
  );

  // Get localized title or fallback to English (using ?? for proper nullish coalescing)
  const title = video.title[locale] ?? video.title.en ?? 'Untitled';
  const description = video.description?.[locale] ?? video.description?.en;

  // Generate Sanity asset URLs
  const posterUrl = video.posterImage
    ? urlFor(video.posterImage).width(1920).height(1080).quality(85).url()
    : undefined;

  const videoUrl = video.videoFile
    ? getFileAssetUrl(video.videoFile)
    : undefined;

  /**
   * Show play/pause overlay with fade animation
   * Overlay shows for 1 second then fades out
   */
  const showOverlay = useCallback((iconType: 'play' | 'pause') => {
    // Clear existing timeout
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }

    // Show overlay with correct icon
    setOverlayIcon(iconType);
    setShowPlayPauseOverlay(true);

    // Hide after 1 second
    overlayTimeoutRef.current = window.setTimeout(() => {
      setShowPlayPauseOverlay(false);
    }, 1000);
  }, []);

  /**
   * Handle tap/click on video - toggle play/pause
   *
   * Mobile considerations:
   * - Prevents double-tap zoom with 300ms debounce
   * - preventDefault stops iOS Safari fullscreen trigger
   * - Works with both touch and click events
   * - Coordinates with scroll-triggered autoplay
   */
  const handleVideoTap = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      // Prevent default browser behavior
      // This prevents iOS Safari from triggering fullscreen on double-tap
      event.preventDefault();
      event.stopPropagation();

      const video = videoRef.current;
      if (!video || !videoUrl) return;

      // Debounce rapid taps to prevent double-tap zoom issues
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTimeRef.current;

      // Ignore taps within 300ms of previous tap (double-tap protection)
      if (timeSinceLastTap < 300) {
        return;
      }

      lastTapTimeRef.current = now;

      // Toggle play/pause
      if (video.paused) {
        // Play video
        play()
          .then(() => {
            showOverlay('pause'); // Show pause icon when playing
          })
          .catch((error) => {
            console.error('[RiverVideoSlot] Manual play failed:', error);
            // Don't show overlay if play failed
          });
      } else {
        // Pause video
        pause();
        showOverlay('play'); // Show play icon when paused
      }
    },
    [videoUrl, play, pause, showOverlay]
  );

  /**
   * Handle touch events specifically for mobile
   * Uses touchend to match native mobile behavior
   */
  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      handleVideoTap(event);
    },
    [handleVideoTap]
  );

  /**
   * Handle click events for desktop
   * Separate from touch to avoid double-firing on mobile
   */
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      // Only handle click if not from a touch event
      const nativeEvent = event.nativeEvent;

      // Type guard for PointerEvent support
      if ('pointerType' in nativeEvent) {
        const pointerEvent = nativeEvent as PointerEvent;
        if (pointerEvent.pointerType === 'mouse' || event.detail === 0) {
          handleVideoTap(event);
        }
      } else {
        // Fallback for browsers without PointerEvent
        if (event.detail !== 0) {
          handleVideoTap(event);
        }
      }
    },
    [handleVideoTap]
  );

  /**
   * Update playback status for screen readers
   */
  useEffect(() => {
    if (!isReady) {
      setPlaybackStatus('loading');
    } else if (isPlaying) {
      setPlaybackStatus('playing');
    } else {
      setPlaybackStatus('paused');
    }
  }, [isPlaying, isReady]);

  /**
   * Enhanced keyboard navigation handler
   * Supports: Space/Enter (play/pause), Escape (stop and blur), Arrow keys (navigate)
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Space or Enter: Toggle play/pause
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleVideoTap(e as any);
      }
      // Escape: Stop video and remove focus
      else if (e.key === 'Escape') {
        e.preventDefault();
        if (videoRef.current && !videoRef.current.paused) {
          pause();
          showOverlay('play');
        }
        containerRef.current?.blur();
      }
      // Arrow Down: Move to next video slot
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextSlot = containerRef.current?.parentElement?.nextElementSibling
          ?.querySelector('[role="button"]') as HTMLElement;
        nextSlot?.focus();
      }
      // Arrow Up: Move to previous video slot
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevSlot = containerRef.current?.parentElement?.previousElementSibling
          ?.querySelector('[role="button"]') as HTMLElement;
        prevSlot?.focus();
      }
    },
    [handleVideoTap, pause, showOverlay]
  );

  /**
   * Handle video loading errors
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      setVideoError(true);
      console.error('[RiverVideoSlot] Video failed to load:', videoUrl);
    };

    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  /**
   * Cleanup overlay timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, []);

  return (
    <article
      className="relative w-full bg-black overflow-hidden group"
      style={{ aspectRatio: '16 / 9' }}
      aria-label={`Video: ${title}${video.year ? ` (${video.year})` : ''}`}
      data-intersection-ratio={intersectionRatio.toFixed(2)}
      data-is-playing={isPlaying}
    >
      {/* Video Element with Touch Handlers */}
      {videoUrl ? (
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-4 focus:ring-offset-black transition-shadow"
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          role="button"
          aria-label={`${title}, ${playbackStatus}. Press Space or Enter to toggle playback, Arrow keys to navigate, Escape to stop.`}
          aria-live="polite"
          aria-describedby={`video-metadata-${video._id}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            poster={posterUrl}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={title}
            disablePictureInPicture
            controlsList="nodownload"
            data-video-id={video._id}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        /* Fallback: Show poster image if no video URL */
        posterUrl && (
          <img
            src={posterUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      )}

      {/* Play/Pause Overlay - Shows on manual interaction */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
          showPlayPauseOverlay ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="bg-black/70 rounded-full p-4 md:p-6 backdrop-blur-sm">
          <PlayPauseIcon isPlaying={overlayIcon === 'pause'} />
        </div>
      </div>

      {/* Video Metadata Overlay */}
      <div
        id={`video-metadata-${video._id}`}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8"
      >
        <div className="max-w-screen-xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-white mb-2">
            {title}
          </h2>

          {video.year && (
            <p className="font-body text-base md:text-lg text-white/90">
              {video.year}
            </p>
          )}

          {description && (
            <p className="font-body text-sm md:text-base text-white/80 mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Screen Reader Status Announcement */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isPlaying ? `${title} is now playing` : playbackStatus === 'loading' ? `${title} is loading` : ''}
      </div>

      {/* Video Error State - Shows when video fails to load */}
      {videoError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center px-6">
            <p className="text-white font-body text-lg mb-2">Unable to load video</p>
            <p className="text-white/70 font-body text-sm">{title}</p>
          </div>
        </div>
      )}

      {/* Loading State Indicator - Shows when video is loading */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none transition-opacity duration-300 ${
          !isReady && videoUrl ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="text-white font-body text-sm">Loading...</div>
      </div>

      {/* Performance Debug Indicator - Only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          className="absolute top-4 right-4 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded pointer-events-none"
          aria-hidden="true"
        >
          <div>Ratio: {(intersectionRatio * 100).toFixed(0)}%</div>
          <div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
          <div>Ready: {isReady ? 'Yes' : 'No'}</div>
        </div>
      )}
    </article>
  );
}
