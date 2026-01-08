'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MuxPlayer from '@mux/mux-player-react';
import { urlFor } from '@/lib/sanity/image';

interface RiverVideoSlotMuxProps {
  video: any;
  locale?: string;
  isFirstVideo?: boolean;
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
}: RiverVideoSlotMuxProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // Intersection Observer for scroll-triggered autoplay (for non-first videos)
  useEffect(() => {
    if (isFirstVideo || !containerRef.current || !playerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Video is more than 50% in viewport, play it
            playerRef.current?.play();
          } else {
            // Video is out of view, pause it
            playerRef.current?.pause();
          }
        });
      },
      {
        threshold: [0.5], // Trigger when 50% of video is visible
        rootMargin: '0px',
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isFirstVideo]);

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

        // Navigate to artwork if linked
        if (video.linkedArtwork?.slug?.current) {
          router.push(`/works/${video.linkedArtwork.slug.current}`);
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
        style={{ aspectRatio: '16 / 9' }}
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
      className="relative w-full bg-black overflow-hidden group"
      style={{ aspectRatio: '16 / 9' }}
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
            objectFit: 'cover',
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* More Button - Only show if artwork is linked */}
      {video.linkedArtwork?.slug?.current && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/works/${video.linkedArtwork.slug.current}`);
          }}
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '8px 16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            zIndex: 10
          }}
          aria-label={`View more about ${title}`}
        >
          More
        </button>
      )}
    </article>
  );
}
