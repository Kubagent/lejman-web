'use client';

import { useRef, useState, useCallback } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { urlFor } from '@/lib/sanity/image';

interface RiverVideoSlotMuxProps {
  video: any;
  locale?: string;
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
}: RiverVideoSlotMuxProps) {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get localized title
  const title = video.title[locale] ?? video.title.en ?? 'Untitled';
  const description = video.description?.[locale] ?? video.description?.en;

  // Get Mux playback ID
  const playbackId = video.video?.asset?.playbackId;

  // Generate poster image URL
  const posterUrl = video.posterImage
    ? urlFor(video.posterImage).width(1920).height(1080).quality(85).url()
    : undefined;

  // Handle player interaction
  const handlePlayerClick = useCallback(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  }, [isPlaying]);

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
          autoPlay="muted"
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
          // Remove default controls for cleaner look
          controls={false}
        />
      </div>

      {/* Video Metadata Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 md:p-8 pointer-events-none">
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

      {/* Playback Status Indicator */}
      <div
        className="absolute top-4 right-4 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        {isPlaying ? 'Playing' : 'Paused'}
      </div>
    </article>
  );
}
