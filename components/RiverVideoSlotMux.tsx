'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MuxPlayer from '@mux/mux-player-react';
import { urlFor } from '@/lib/sanity/image';

interface RiverVideoSlotMuxProps {
  video: any;
  locale?: string;
  isFirstVideo?: boolean;
  isActive?: boolean;
  onPlay?: (videoId: string) => void;
}

/**
 * RiverVideoSlotMux - Mux-powered video slot for the river layout
 *
 * Uses Mux Player for optimized video streaming with:
 * - Adaptive bitrate streaming
 * - Automatic quality selection
 * - Low latency playback
 * - Built-in analytics
 */
export default function RiverVideoSlotMux({
  video,
  locale = 'en',
  isFirstVideo = false,
  isActive = false,
  onPlay,
}: RiverVideoSlotMuxProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for scroll-triggered autoplay
  // Desktop: play when 50% visible
  // Mobile: play ONLY when fully visible (100%), pause immediately when any part scrolls out
  useEffect(() => {
    if (!containerRef.current) return;

    if (isMobile) {
      // Mobile: strict visibility - only play when fully in view to minimize Mux minutes
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
              // Video is fully in view, play it
              playerRef.current?.play();
              onPlay?.(video._id);
            } else {
              // Video is not fully in view, pause to save Mux minutes
              playerRef.current?.pause();
            }
          });
        },
        {
          threshold: [0, 0.95], // Trigger at 0% (leaving) and 95% (nearly full view)
          rootMargin: '0px',
        }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      // Desktop: original behavior - play when 50% visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              onPlay?.(video._id);
            }
          });
        },
        {
          threshold: [0.5],
          rootMargin: '0px',
        }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [onPlay, video._id, isMobile]);

  // Handle play/pause based on active state from parent (desktop only)
  // Mobile handles its own play/pause via the observer above
  useEffect(() => {
    if (!playerRef.current || isMobile) return;

    if (isActive) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [isActive, isMobile]);

  // For first video: register as active when it starts playing via autoPlay
  useEffect(() => {
    if (!isFirstVideo) return;

    const player = playerRef.current;
    if (!player) return;

    const handleFirstVideoPlay = () => {
      onPlay?.(video._id);
    };

    // MuxPlayer emits 'play' event when playback starts
    player.addEventListener('play', handleFirstVideoPlay);

    return () => {
      player.removeEventListener('play', handleFirstVideoPlay);
    };
  }, [isFirstVideo, onPlay, video._id]);

  // Get localized title
  const title = video.title[locale] ?? video.title.en ?? 'Untitled';

  // Get Mux playback ID
  const playbackId = video.video?.asset?.playbackId;

  // Generate poster image URL
  const posterUrl = video.posterImage
    ? urlFor(video.posterImage).width(1920).height(1080).quality(85).url()
    : undefined;

  // Handle player interaction with double-click detection
  // Single click: play/pause after 300ms delay
  // Double click: navigate to artwork immediately
  const handlePlayerClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      clickCountRef.current += 1;

      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // If this is a potential double-click (second click within delay period)
      if (clickCountRef.current === 2) {
        clickCountRef.current = 0;

        // Navigate to artwork/project if linked
        if (video.linkedArtwork?.slug?.current) {
          const basePath = video.linkedArtwork._type === 'project' ? '/projects' : '/works';
          router.push(`${basePath}/${video.linkedArtwork.slug.current}`);
          return;
        }
      }

      // Wait 300ms to see if another click comes (double-click)
      clickTimeoutRef.current = setTimeout(() => {
        // Single click confirmed - toggle play/pause
        if (clickCountRef.current === 1 && playerRef.current) {
          if (isPlaying) {
            playerRef.current.pause();
          } else {
            playerRef.current.play();
          }
        }
        clickCountRef.current = 0;
      }, 300);
    },
    [isPlaying, video.linkedArtwork, router]
  );

  if (!playbackId) {
    return (
      <article
        className="relative w-full bg-black overflow-hidden"
        style={{
          height: 'calc(100vh - 40px)'
        }}
        aria-label={`Video: ${title} - Not available`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-white/70 font-body text-sm">Video not available</p>
            <p className="text-white/50 font-body text-xs mt-2">
              Please upload a video in Sanity Studio
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden group h-[80vw] md:h-[calc(100vh-20px)]"
      style={{ maxHeight: 'calc(100vh - 20px)' }}
      aria-label={`Video: ${title}${video.year ? ` (${video.year})` : ''}`}
    >
      {/* Mux Player */}
      <div
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={handlePlayerClick}
      >
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          poster={posterUrl}
          streamType="on-demand"
          autoPlay={isFirstVideo ? "muted" : undefined}
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            '--media-object-fit': 'cover',
            '--media-object-position': 'center',
          } as any}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* More Link - Always visible, greyed out when no link */}
      {video.linkedArtwork?.slug?.current ? (
        <Link
          href={`${video.linkedArtwork._type === 'project' ? '/projects' : '/works'}/${video.linkedArtwork.slug.current}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            fontWeight: 400,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            padding: '6px 10px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
            zIndex: 10,
            textDecoration: 'none'
          }}
          aria-label={`More about ${title} - view artwork details`}
        >
          More
        </Link>
      ) : (
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.4)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(4px)',
            padding: '6px 10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'default',
            zIndex: 10
          }}
          aria-label="No linked content available"
        >
          More
        </span>
      )}
    </article>
  );
}
