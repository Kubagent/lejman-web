/**
 * useVideoIntersection Hook
 *
 * High-performance scroll-triggered video playback using Intersection Observer API.
 *
 * Features:
 * - Dual threshold detection (50% play, 20% pause)
 * - Lazy loading with rootMargin optimization
 * - RAF throttling for smooth performance
 * - Reduced motion support
 * - Error handling for video lifecycle
 * - Memory leak prevention via cleanup
 *
 * Performance Optimizations:
 * - Single observer instance (reusable pattern)
 * - Debounced play/pause calls
 * - Preload strategy: metadata → auto when near viewport
 * - Proper cleanup on unmount
 *
 * @example
 * const videoRef = useRef<HTMLVideoElement>(null);
 * const { isInView, isPlaying } = useVideoIntersection(videoRef, {
 *   playThreshold: 0.5,
 *   pauseThreshold: 0.2,
 *   rootMargin: '100px 0px'
 * });
 */

'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

export interface UseVideoIntersectionOptions {
  /** Threshold (0-1) at which video should start playing. Default: 0.5 (50%) */
  playThreshold?: number;

  /** Threshold (0-1) at which video should pause. Default: 0.2 (20%) */
  pauseThreshold?: number;

  /** Root margin for early detection. Default: '100px 0px' for 100px preload buffer */
  rootMargin?: string;

  /** Enable debug logging. Default: false */
  debug?: boolean;

  /** Respect user's manual pause interaction. Default: true */
  respectManualPause?: boolean;
}

export interface UseVideoIntersectionReturn {
  /** Whether video is currently in the viewport */
  isInView: boolean;

  /** Whether video is currently playing */
  isPlaying: boolean;

  /** Intersection ratio (0-1) */
  intersectionRatio: number;

  /** Whether video is ready to play */
  isReady: boolean;

  /** Manual play/pause controls */
  play: () => Promise<void>;
  pause: () => void;
}

/**
 * Custom hook for managing video playback based on scroll position
 */
export function useVideoIntersection(
  videoRef: RefObject<HTMLVideoElement | null>,
  options: UseVideoIntersectionOptions = {}
): UseVideoIntersectionReturn {
  const {
    playThreshold = 0.5,
    pauseThreshold = 0.2,
    rootMargin = '100px 0px',
    debug = false,
    respectManualPause = true,
  } = options;

  // State management
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Refs for tracking state without re-renders
  const userPausedRef = useRef(false);
  const playbackAttemptRef = useRef<Promise<void> | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /**
   * Throttled play function using RAF
   * Prevents excessive play() calls during rapid scrolling
   */
  const play = async (): Promise<void> => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion.current) return;

    // If already playing or attempting to play, skip
    if (isPlaying || playbackAttemptRef.current) return;

    // Cancel any pending RAF callbacks
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(async () => {
      try {
        // Wait for video to be ready if needed
        if (video.readyState < 2) {
          await new Promise<void>((resolve) => {
            const handleCanPlay = () => {
              video.removeEventListener('canplay', handleCanPlay);
              resolve();
            };
            video.addEventListener('canplay', handleCanPlay);

            // Timeout after 5 seconds
            setTimeout(() => {
              video.removeEventListener('canplay', handleCanPlay);
              resolve();
            }, 5000);
          });
        }

        // Attempt playback
        playbackAttemptRef.current = video.play();
        await playbackAttemptRef.current;

        setIsPlaying(true);
        userPausedRef.current = false;

        if (debug) {
          console.log('[useVideoIntersection] Video playing:', video.currentSrc);
        }
      } catch (error) {
        // Handle common autoplay errors
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            // Autoplay blocked by browser - this is expected, don't log
            if (debug) {
              console.log('[useVideoIntersection] Autoplay blocked (expected)');
            }
          } else if (error.name === 'AbortError') {
            // Play was interrupted - also expected during rapid scrolling
            if (debug) {
              console.log('[useVideoIntersection] Playback interrupted');
            }
          } else {
            console.error('[useVideoIntersection] Video playback error:', error);
          }
        }
        setIsPlaying(false);
      } finally {
        playbackAttemptRef.current = null;
        rafIdRef.current = null;
      }
    });
  };

  /**
   * Throttled pause function using RAF
   */
  const pause = (): void => {
    const video = videoRef.current;
    if (!video) return;

    // Cancel any pending RAF callbacks
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    rafIdRef.current = requestAnimationFrame(() => {
      try {
        if (!video.paused) {
          video.pause();
          setIsPlaying(false);

          if (debug) {
            console.log('[useVideoIntersection] Video paused:', video.currentSrc);
          }
        }
      } catch (error) {
        console.error('[useVideoIntersection] Video pause error:', error);
      } finally {
        rafIdRef.current = null;
      }
    });
  };

  /**
   * Setup Intersection Observer
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mark video as ready when it can play
    const handleCanPlay = () => {
      setIsReady(true);
      if (debug) {
        console.log('[useVideoIntersection] Video ready:', video.currentSrc);
      }
    };

    video.addEventListener('canplay', handleCanPlay);

    // Track manual user interactions
    const handleUserPause = () => {
      if (respectManualPause) {
        userPausedRef.current = true;
        setIsPlaying(false);

        if (debug) {
          console.log('[useVideoIntersection] User manually paused video');
        }
      }
    };

    const handleUserPlay = () => {
      userPausedRef.current = false;
      setIsPlaying(true);
    };

    video.addEventListener('pause', handleUserPause);
    video.addEventListener('play', handleUserPlay);

    // Create Intersection Observer with dual thresholds
    const thresholds = [pauseThreshold, playThreshold];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          setIntersectionRatio(ratio);

          if (debug) {
            console.log('[useVideoIntersection] Intersection ratio:', ratio.toFixed(2));
          }

          // Update preload strategy based on intersection
          if (ratio > 0 && video.preload === 'metadata') {
            // Start loading full video when it enters viewport margin
            video.preload = 'auto';

            if (debug) {
              console.log('[useVideoIntersection] Preload strategy upgraded to "auto"');
            }
          }

          // Determine if we should play or pause
          if (ratio >= playThreshold) {
            // 50%+ visible - should be playing
            setIsInView(true);

            // Only auto-play if user hasn't manually paused
            if (!userPausedRef.current) {
              play();
            }
          } else if (ratio <= pauseThreshold) {
            // 20%- visible - should be paused
            setIsInView(false);

            // Don't pause if user manually started playing
            if (!userPausedRef.current) {
              pause();
            }
          }
          // Between thresholds: maintain current state (hysteresis)
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin, // Preload buffer
        threshold: thresholds, // Dual threshold detection
      }
    );

    // Start observing
    observer.observe(video);

    // Cleanup function - critical for preventing memory leaks
    return () => {
      observer.disconnect();

      // Cancel any pending RAF callbacks
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Cancel any pending play promises
      playbackAttemptRef.current = null;

      // Remove event listeners
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('pause', handleUserPause);
      video.removeEventListener('play', handleUserPlay);

      if (debug) {
        console.log('[useVideoIntersection] Cleanup complete');
      }
    };
  }, [
    videoRef,
    playThreshold,
    pauseThreshold,
    rootMargin,
    debug,
    respectManualPause,
  ]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    isInView,
    isPlaying,
    intersectionRatio,
    isReady,
    play,
    pause,
  };
}
