# useVideoIntersection Hook - Testing Guide

## Manual Testing Checklist

### Basic Functionality

- [ ] **Initial Load**
  - Videos do not autoplay on page load
  - Only metadata is loaded (check Network tab)
  - Poster images are visible immediately

- [ ] **Scroll Down (First Time)**
  - Video starts preloading when within 100px of viewport
  - Video starts playing when 50% visible
  - Video continues playing when scrolling past 50%
  - Video pauses when less than 20% visible

- [ ] **Scroll Up**
  - Video resumes playing when scrolling back up to 50%
  - Video pauses again when less than 20% visible
  - Smooth transitions without flickering

- [ ] **Hysteresis Zone (20%-50%)**
  - Slow scroll in this zone maintains current state
  - No flickering between play/pause
  - Smooth user experience

### Performance Testing

- [ ] **Fast Scrolling**
  - No excessive play/pause calls (check console with debug: true)
  - Maintains 60fps (check Performance tab)
  - No janky animations or stuttering

- [ ] **Multiple Videos**
  - Only one video plays at a time (typically)
  - Videos outside viewport are paused
  - Memory usage remains stable

- [ ] **Rapid Direction Changes**
  - Videos respond appropriately to scroll reversals
  - No race conditions or stuck states
  - RAF throttling prevents excessive calls

### User Interaction

- [ ] **Manual Pause**
  - Click pause on video controls
  - Scroll video out and back in
  - Video should NOT auto-resume (respectManualPause: true)

- [ ] **Manual Play**
  - Click play on video controls
  - Scroll video partially out (but > 20%)
  - Video should continue playing

- [ ] **Full Screen**
  - Enter fullscreen mode
  - Exit fullscreen
  - Video behavior resumes normally

### Network Conditions

Use Chrome DevTools > Network > Throttling

- [ ] **Fast 3G**
  - Videos preload smoothly
  - No buffering during playback
  - Preload strategy works correctly

- [ ] **Slow 3G**
  - Videos show loading state
  - Playback begins when ready
  - No errors in console

- [ ] **Offline**
  - Videos that haven't loaded show error state gracefully
  - Previously loaded videos work
  - No crashes or infinite loading

### Browser Compatibility

- [ ] **Chrome (Desktop)**
  - All features work
  - DevTools shows proper Intersection Observer

- [ ] **Firefox (Desktop)**
  - All features work
  - Performance is smooth

- [ ] **Safari (Desktop)**
  - All features work
  - Autoplay works with muted attribute

- [ ] **iOS Safari (Mobile)**
  - Autoplay works with playsInline attribute
  - Touch scrolling is smooth
  - No memory issues on repeated scrolling

- [ ] **Chrome Mobile (Android)**
  - Autoplay works correctly
  - Performance is smooth on scrolling
  - Battery usage is reasonable

### Accessibility

- [ ] **Reduced Motion (macOS)**
  - System Preferences > Accessibility > Display > Reduce Motion
  - Videos should NOT autoplay
  - Manual play still works

- [ ] **Reduced Motion (DevTools)**
  - Chrome DevTools > Rendering > Emulate CSS prefers-reduced-motion
  - Videos should NOT autoplay
  - Verify with debug mode

- [ ] **Screen Reader**
  - Video labels are announced correctly
  - Controls are accessible via keyboard
  - ARIA labels are appropriate

- [ ] **Keyboard Navigation**
  - Tab to video controls
  - Space/Enter to play/pause
  - Focus indicators are visible

### Edge Cases

- [ ] **No Video URL**
  - Poster image fallback is shown
  - No errors in console
  - Component renders gracefully

- [ ] **Invalid Video URL (404)**
  - Video shows poster image
  - Error handling is graceful
  - No infinite loading state

- [ ] **Corrupted Video**
  - Error event is handled
  - Poster image fallback
  - Console shows appropriate error

- [ ] **Tab Switch**
  - Switch to another tab
  - Videos should pause (browser behavior)
  - Return to tab - appropriate video resumes

- [ ] **Window Resize**
  - Resize browser window
  - Intersection observer updates correctly
  - No broken states

### Memory Leak Testing

- [ ] **Repeated Scrolling**
  1. Open Chrome DevTools > Memory
  2. Take heap snapshot (baseline)
  3. Scroll through all videos 10 times
  4. Force garbage collection (trash icon)
  5. Take heap snapshot (after)
  6. Compare - should be similar sizes

- [ ] **Component Unmount**
  - Navigate away from page
  - Return to page
  - Check Memory tab for detached DOM nodes
  - Should be minimal/zero leaks

### Performance Profiling

- [ ] **Chrome DevTools Performance**
  1. Open Performance tab
  2. Click Record
  3. Scroll through all 5 videos slowly
  4. Stop recording
  5. Analyze:
     - Scripting time should be minimal
     - No long tasks (> 50ms)
     - RAF calls are throttled
     - FPS stays at 60

- [ ] **Network Efficiency**
  1. Open Network tab
  2. Refresh page
  3. Check initial load: Only ~250KB (5 metadata files)
  4. Scroll to first video: Full video loads
  5. Total loaded: Only visible + adjacent videos

### Debug Mode Testing

Enable debug mode in RiverVideoSlot.tsx:
```typescript
debug: true
```

- [ ] **Console Logging**
  - Intersection ratio updates appear
  - Play/pause events are logged
  - Preload strategy upgrade is logged
  - Error events are logged clearly

- [ ] **Visual Indicators (Development)**
  - Top-right corner shows:
    - Ratio percentage (0-100%)
    - Status (Playing/Paused)
    - Ready state (Yes/No)

## Performance Benchmarks

Record these metrics for comparison:

### Initial Load
- [ ] Total page weight: _________ KB
- [ ] Time to interactive: _________ s
- [ ] First Contentful Paint: _________ s
- [ ] Videos loaded initially: _________

### Runtime Performance
- [ ] Average FPS during scroll: _________ fps
- [ ] Peak CPU usage: _________ %
- [ ] Memory usage (stable): _________ MB
- [ ] Memory after 10 scrolls: _________ MB

### Expected Results
```
Initial Load: ~250KB (5 metadata)
Time to Interactive: < 2s (3G)
Scroll FPS: 58-60fps
Memory: Stable (no growth after GC)
```

## Common Issues & Solutions

### Issue: Videos Not Autoplaying
**Solutions:**
- Verify `muted` attribute on video element
- Check `playsInline` for iOS Safari
- Enable debug mode to see errors
- Check browser autoplay policy in console

### Issue: Videos Loading Too Late
**Solutions:**
- Increase `rootMargin` value (e.g., '200px 0px')
- Check network speed (may be throttled)
- Verify Intersection Observer is firing (debug mode)

### Issue: Janky Scrolling
**Solutions:**
- Verify RAF throttling is active
- Check for multiple observers on same element
- Reduce quality/size of video files
- Test on different device

### Issue: Memory Leaks
**Solutions:**
- Verify cleanup useEffect is running on unmount
- Check for event listeners not being removed
- Force garbage collection in DevTools
- Profile with Memory tab

### Issue: Videos Play Simultaneously
**Expected Behavior:**
- This can happen when multiple videos cross 50% threshold
- Working as designed - each video is independent
- If needed, implement singleton play logic in River.tsx

## Automated Testing (Future)

```typescript
// Example Vitest test
describe('useVideoIntersection', () => {
  it('should start playing when 50% visible', () => {
    // Mock Intersection Observer
    // Trigger intersection at 0.5 ratio
    // Assert video.play() was called
  });

  it('should pause when 20% visible', () => {
    // Mock Intersection Observer
    // Trigger intersection at 0.2 ratio
    // Assert video.pause() was called
  });

  it('should respect manual pause', () => {
    // User manually pauses
    // Scroll to 50% visible
    // Assert video does NOT auto-resume
  });
});
```

## Reporting Issues

When reporting issues, include:

1. **Browser & Version**: Chrome 120, Safari 17, etc.
2. **Device**: Desktop, iPhone 14, etc.
3. **Network**: Fast 3G, Offline, etc.
4. **Steps to Reproduce**: Detailed steps
5. **Console Errors**: Copy full error messages
6. **Debug Output**: Enable debug mode and include logs
7. **Expected vs Actual**: What should happen vs what does happen

## Sign-off Checklist

Before considering implementation complete:

- [ ] All basic functionality tests pass
- [ ] Performance benchmarks meet targets
- [ ] No console errors in any browser
- [ ] Memory profiling shows no leaks
- [ ] Accessibility tests pass
- [ ] Mobile testing complete
- [ ] Documentation is accurate
- [ ] Code review completed
