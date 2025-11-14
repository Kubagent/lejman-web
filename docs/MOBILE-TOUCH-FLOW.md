# Mobile Touch Interaction Flow

## Visual Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  RiverVideoSlot Component                                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Touch Wrapper (role="button", tabIndex={0})            │ │
│  │ - onTouchEnd → handleTouchEnd (mobile)                 │ │
│  │ - onClick → handleClick (desktop)                      │ │
│  │ - onKeyDown → Space/Enter support                      │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ <video> (pointer-events-none)                    │  │ │
│  │  │ - ref={videoRef}                                 │  │ │
│  │  │ - muted, loop, playsInline                       │  │ │
│  │  │ - poster={posterUrl}                             │  │ │
│  │  │ - Controlled by useVideoIntersection hook        │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Play/Pause Overlay (conditional, fade animation) │  │ │
│  │  │ - Shows on manual interaction only               │  │ │
│  │  │ - Displays for 1 second then fades               │  │ │
│  │  │ - Icon: Play (paused) or Pause (playing)         │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Metadata Overlay (bottom gradient)                     │ │
│  │ - Title, year, description                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Event Flow Diagram

### Touch Event Sequence

```
User Touches Screen
        ↓
    touchstart
        ↓
    (user holds)
        ↓
    touchend  ──────────→  handleTouchEnd()
        ↓                         ↓
    (300ms delay)           handleVideoTap()
        ↓                         ↓
    synthetic click         event.preventDefault()
    (BLOCKED)               event.stopPropagation()
                                  ↓
                            Debounce Check
                            (300ms window)
                                  ↓
                            ┌─────┴─────┐
                            │           │
                        < 300ms     ≥ 300ms
                            │           │
                         IGNORE     PROCESS
                                        ↓
                                  Toggle Video
                                        ↓
                            ┌───────────┴───────────┐
                            │                       │
                        video.paused          !video.paused
                            │                       │
                        play()                   pause()
                            │                       │
                     show "pause" icon       show "play" icon
                            │                       │
                            └───────────┬───────────┘
                                        ↓
                                  Overlay Visible
                                        ↓
                                  (wait 1000ms)
                                        ↓
                                  Overlay Fades Out
```

### Click Event Sequence (Desktop)

```
User Clicks Mouse
        ↓
    mousedown
        ↓
    mouseup
        ↓
    click  ──────────→  handleClick()
        ↓                     ↓
                        Check pointerType
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
                'touch'             'mouse'
                    │                   │
                IGNORE          handleVideoTap()
                                        ↓
                                (same flow as touch)
```

## State Machine

### Video Playback State

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         INITIAL                              │
│                     (poster showing)                         │
│                            │                                 │
│                            │ scroll to 50%                   │
│                            ↓                                 │
│                        AUTOPLAY                              │
│                    (scroll triggered)                        │
│                            │                                 │
│              ┌─────────────┼─────────────┐                  │
│              │             │             │                  │
│         user tap      scroll < 20%   scroll 20-50%          │
│              │             │             │                  │
│              ↓             ↓             ↓                  │
│          MANUAL         PAUSED      MAINTAIN                │
│          PLAY       (auto-paused)    STATE                  │
│         (user)            │       (hysteresis)              │
│              │            │             │                  │
│              │     scroll to 50%        │                  │
│              │            │             │                  │
│              │            ↓             │                  │
│              │         AUTOPLAY         │                  │
│              │            │             │                  │
│              │            │             │                  │
│         user tap          │        user tap                │
│              │            │             │                  │
│              ↓            ↓             ↓                  │
│          MANUAL ←────────────────────────                   │
│          PAUSE                                              │
│         (user)                                              │
│              │                                              │
│              │ user tap                                     │
│              ↓                                              │
│          MANUAL                                             │
│          PLAY                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Overlay State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                         HIDDEN                               │
│                     (opacity: 0)                             │
│                            │                                 │
│                      user tap video                          │
│                            │                                 │
│                            ↓                                 │
│                        FADE IN                               │
│                    (200ms transition)                        │
│                            │                                 │
│                            ↓                                 │
│                        VISIBLE                               │
│                     (opacity: 100)                           │
│                  (icon: play or pause)                       │
│                            │                                 │
│                    ┌───────┴───────┐                        │
│                    │               │                        │
│              wait 1000ms      user taps again                │
│                    │               │                        │
│                    │        (reset timer)                    │
│                    │               │                        │
│                    ↓               ↓                        │
│                FADE OUT         VISIBLE                      │
│            (200ms transition)  (new icon)                    │
│                    │               │                        │
│                    ↓               │                        │
│                 HIDDEN ←───────────┘                        │
│                                 (after 1000ms)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Layer Stack

### Z-Index Hierarchy (bottom to top)

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: Debug Info (dev only)         z-index: auto        │
│          [Ratio: 75% | Status: Playing | Ready: Yes]        │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Metadata Overlay               z-index: auto       │
│          [Title, Year, Description]                         │
│          Gradient: black/80 → transparent                   │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Play/Pause Overlay             z-index: auto       │
│          [Icon with backdrop blur]                          │
│          Conditional render (tap only)                      │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Loading Indicator              z-index: auto       │
│          [Loading...]                                       │
│          Conditional render (!isReady)                      │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Touch Wrapper + Video          z-index: auto       │
│          Touch handlers here                                │
│          Video: pointer-events-none                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 0: Container (article)            z-index: auto       │
│          Background: black                                  │
│          Aspect ratio: 16/9                                 │
└─────────────────────────────────────────────────────────────┘
```

## Touch Event Timeline

### Successful Tap (iOS Safari)

```
Time (ms)    Event                           State
────────────────────────────────────────────────────────────────
0            User finger down                touchstart fires

100          User holds finger               (waiting)

150          User lifts finger               touchend fires
                                             ↓
150          handleTouchEnd called           preventDefault()
                                             stopPropagation()
                                             ↓
151          Debounce check                  lastTap = 0
                                             now = 150
                                             diff = 150 ✓
                                             ↓
152          Toggle video                    video.paused = true
                                             call play()
                                             ↓
200          Video starts                    isPlaying = true
                                             showOverlay('pause')
                                             ↓
200          Overlay fades in                opacity: 0 → 100
                                             (200ms transition)
                                             ↓
400          Overlay fully visible           timeout set (1000ms)

1400         Timeout fires                   Start fade out
                                             ↓
1400         Overlay fades out               opacity: 100 → 0
                                             (200ms transition)
                                             ↓
1600         Overlay hidden                  Complete

450          Synthetic click (iOS delay)     IGNORED
                                             (preventDefault blocked)
```

### Rapid Double-Tap (Prevented)

```
Time (ms)    Event                           State
────────────────────────────────────────────────────────────────
0            First tap                       touchend fires
                                             ↓
1            Process first tap               lastTap = 0
                                             Toggle video ✓

150          Second tap                      touchend fires
                                             ↓
151          Debounce check                  lastTap = 0
                                             now = 150
                                             diff = 150 < 300 ✗
                                             ↓
151          IGNORED                         No action
                                             (prevents zoom)
```

## Hook Integration Flow

### useVideoIntersection Hook Coordination

```
┌────────────────────────────────────────────────────────────┐
│  useVideoIntersection Hook                                 │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Intersection Observer                                │  │
│  │  - Watches video element                             │  │
│  │  - Calculates intersection ratio                     │  │
│  │  - Updates state on scroll                           │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                              │
│                             ↓                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Play/Pause Logic                                     │  │
│  │                                                       │  │
│  │  if (ratio ≥ 50% && !userPausedRef.current)         │  │
│  │    → play()                                          │  │
│  │                                                       │  │
│  │  if (ratio ≤ 20% && !userPausedRef.current)         │  │
│  │    → pause()                                         │  │
│  │                                                       │  │
│  │  userPausedRef updated on manual interactions       │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                              │
│                             ↓                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Return Values                                        │  │
│  │  - isPlaying: boolean                                │  │
│  │  - play: () => Promise<void>                         │  │
│  │  - pause: () => void                                 │  │
│  │  - isReady: boolean                                  │  │
│  └──────────────────────────┬───────────────────────────┘  │
└─────────────────────────────┼──────────────────────────────┘
                              │
                              │ Used by
                              ↓
┌────────────────────────────────────────────────────────────┐
│  RiverVideoSlot Component                                  │
│                                                             │
│  handleVideoTap() calls:                                   │
│    - play() → sets userPausedRef = false                   │
│    - pause() → sets userPausedRef = true                   │
│                                                             │
│  Scroll away:                                              │
│    - ratio ≤ 20% → resets userPausedRef                    │
│                                                             │
│  Result:                                                   │
│    - Manual interactions preserved                         │
│    - Autoplay resumes after scroll away                    │
└────────────────────────────────────────────────────────────┘
```

## Mobile Browser Differences

### iOS Safari Touch Sequence

```
touchstart
    ↓
touchmove (if finger moves)
    ↓
touchend
    ↓
(~300ms delay)
    ↓
mousemove (synthetic)
    ↓
mousedown (synthetic)
    ↓
mouseup (synthetic)
    ↓
click (synthetic)
```

**Our handling:**
- Listen to `touchend` (earliest event)
- Call `preventDefault()` (blocks synthetic events)
- Ignore `click` if from touch (check `pointerType`)

### Android Chrome Touch Sequence

```
touchstart
    ↓
touchmove (if finger moves)
    ↓
touchend
    ↓
(~100ms delay, shorter than iOS)
    ↓
click (synthetic)
```

**Our handling:**
- Same as iOS
- Shorter delay but same logic
- Less aggressive gesture detection

### Desktop Click Sequence

```
mousedown
    ↓
mouseup
    ↓
click
```

**Our handling:**
- Listen to `click` only
- Check `pointerType === 'mouse'`
- No preventDefault needed

## Performance Metrics

### Target Performance

```
┌─────────────────────────────────────────────────────────┐
│ Metric                    Target         Acceptable     │
├─────────────────────────────────────────────────────────┤
│ Tap response time         < 16ms         < 50ms         │
│ Overlay fade in           200ms          200ms (fixed)  │
│ Overlay fade out          200ms          200ms (fixed)  │
│ Debounce threshold        300ms          300ms (fixed)  │
│ Scroll FPS                60fps          > 30fps        │
│ Memory growth             0MB/min        < 5MB/min      │
│ Play() promise time       < 100ms        < 500ms        │
└─────────────────────────────────────────────────────────┘
```

### Optimization Points

1. **useCallback dependencies**
   - Minimal deps = less re-creation
   - Stable refs prevent unnecessary renders

2. **RAF throttling**
   - Inherited from useVideoIntersection
   - Prevents play/pause spam

3. **CSS transitions**
   - Hardware accelerated (opacity)
   - No layout thrashing

4. **Event handlers**
   - Passive where possible
   - preventDefault only when needed

---

**Last Updated:** 2025-11-13
**Visual Version:** 1.0
**Related Docs:** MOBILE-TOUCH-INTERACTIONS.md, MOBILE-TESTING-GUIDE.md
