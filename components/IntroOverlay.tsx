'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MuxPlayer from '@mux/mux-player-react';
import { urlFor } from '@/lib/sanity/image';

const INTRO_DURATION = 10000; // 10 seconds
const SESSION_KEY = 'lejman-intro-seen';

interface IntroOverlayProps {
  video: any;
  children: React.ReactNode;
}

/**
 * IntroOverlay - Full-screen intro video that appears once per session
 *
 * Features:
 * - Shows full-screen video on first visit of session
 * - Skip button in bottom right corner
 * - Auto-dismisses after 10 seconds
 * - Uses sessionStorage to track if seen (resets on browser close)
 * - Smooth fade-out transition
 * - Uses React Portal to render above everything
 */
export default function IntroOverlay({ video, children }: IntroOverlayProps) {
  const playerRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if component is mounted (for portal) and check sessionStorage
  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setShowIntro(false);
    }
  }, []);

  // Start auto-dismiss timer when intro is shown
  useEffect(() => {
    if (mounted && showIntro && !isFadingOut) {
      timerRef.current = setTimeout(() => {
        dismissIntro();
      }, INTRO_DURATION);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [mounted, showIntro, isFadingOut]);

  // Lock body scroll when intro is showing
  useEffect(() => {
    if (mounted && showIntro && !isFadingOut) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted, showIntro, isFadingOut]);

  const dismissIntro = useCallback(() => {
    if (isFadingOut) return;

    // Clear timer if skip was clicked
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start fade out
    setIsFadingOut(true);

    // Mark as seen in sessionStorage
    sessionStorage.setItem(SESSION_KEY, 'true');

    // After fade animation, hide overlay
    setTimeout(() => {
      setShowIntro(false);
    }, 500); // Match CSS transition duration
  }, [isFadingOut]);

  // Get Mux playback ID
  const playbackId = video?.video?.asset?.playbackId;

  // Generate poster image URL
  const posterUrl = video?.posterImage
    ? urlFor(video.posterImage).width(1920).height(1080).quality(85).url()
    : undefined;

  // No video available, skip intro entirely
  if (!playbackId) {
    return <>{children}</>;
  }

  // Not mounted yet (SSR) or intro already seen, show children directly
  if (!mounted || !showIntro) {
    return <>{children}</>;
  }

  // Render intro overlay via portal to body (above everything)
  const introOverlay = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: '#000000',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      {/* Full-screen Video */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          poster={posterUrl}
          streamType="on-demand"
          autoPlay="muted"
          loop={false}
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            '--media-object-fit': 'cover',
            '--media-object-position': 'center',
          } as any}
        />
      </div>

      {/* Skip Button */}
      <button
        onClick={dismissIntro}
        style={{
          position: 'absolute',
          bottom: '72px',
          right: '72px',
          zIndex: 10,
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#FFFFFF',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          padding: '10px 20px',
          cursor: 'pointer',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        aria-label="Skip intro"
      >
        Skip
      </button>
    </div>
  );

  return (
    <>
      {createPortal(introOverlay, document.body)}
      {/* Children always rendered, visible when intro fades */}
      {children}
    </>
  );
}
