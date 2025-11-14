# Custom React Hooks

## useVideoIntersection

High-performance scroll-triggered video playback using the Intersection Observer API.

### Quick Start

```typescript
import { useVideoIntersection } from '@/lib/hooks';

function VideoComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { isInView, isPlaying, intersectionRatio, isReady } = useVideoIntersection(
    videoRef,
    {
      playThreshold: 0.5,      // Play at 50% visible
      pauseThreshold: 0.2,     // Pause at 20% visible
      rootMargin: '100px 0px', // Preload 100px early
    }
  );

  return (
    <video ref={videoRef} muted loop playsInline preload="metadata">
      <source src="/video.mp4" type="video/mp4" />
    </video>
  );
}
```

### How It Works

```
Viewport Flow:
┌─────────────────────────────────────┐
│                                     │
│  rootMargin: 100px ← Preload starts │
├─────────────────────────────────────┤
│         VISIBLE VIEWPORT            │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  [====== VIDEO 50% ======] │ ← Play starts
│  │                             │   │
│  │  [== VIDEO 20% ==]          │ ← Pause triggers
│  │                             │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  rootMargin: 100px ← Preload buffer │
│                                     │
└─────────────────────────────────────┘
```

### State Machine

```
Video Lifecycle:

┌──────────┐
│  LOADED  │ (preload="metadata")
└────┬─────┘
     │ Enters rootMargin
     ▼
┌──────────┐
│ PRELOAD  │ (preload="auto")
└────┬─────┘
     │ 50% visible
     ▼
┌──────────┐
│ PLAYING  │ ◄─┐ Hysteresis zone
└────┬─────┘   │ (20%-50%)
     │ 20% visible
     ▼         │
┌──────────┐   │
│  PAUSED  │ ──┘
└──────────┘
```

### Performance Features

1. **RAF Throttling**: Play/pause calls synced with browser repaint (60fps)
2. **Lazy Loading**: Videos load only when near viewport
3. **Memory Safety**: Automatic cleanup prevents leaks
4. **Error Handling**: Graceful degradation for all edge cases
5. **Reduced Motion**: Respects accessibility preferences

### API Reference

#### Options

```typescript
interface UseVideoIntersectionOptions {
  playThreshold?: number;      // Default: 0.5 (50%)
  pauseThreshold?: number;     // Default: 0.2 (20%)
  rootMargin?: string;         // Default: '100px 0px'
  debug?: boolean;             // Default: false
  respectManualPause?: boolean; // Default: true
}
```

#### Return Values

```typescript
interface UseVideoIntersectionReturn {
  isInView: boolean;           // Video in viewport
  isPlaying: boolean;          // Video currently playing
  intersectionRatio: number;   // Visible ratio (0-1)
  isReady: boolean;            // Video can play
  play: () => Promise<void>;   // Manual play control
  pause: () => void;           // Manual pause control
}
```

### Browser Compatibility

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- iOS Safari 12.2+
- Edge 79+

Coverage: 96%+ of global users

### Related Documentation

- [Full Performance Guide](/PERFORMANCE_OPTIMIZATION.md)
- [Component Implementation](/components/RiverVideoSlot.tsx)
- [Intersection Observer MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
