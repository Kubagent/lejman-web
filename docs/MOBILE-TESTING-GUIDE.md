# Mobile Touch Testing Guide

## Quick Start Testing

### Local Development Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Find your local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig | findstr IPv4
   ```

3. **Access from mobile device:**
   - Connect phone to same WiFi network
   - Visit `http://[YOUR-IP]:3000`
   - Example: `http://192.168.1.100:3000`

### iOS Safari Testing

#### Remote Debugging (macOS + iOS)

1. **Enable Web Inspector on iPhone:**
   - Settings → Safari → Advanced → Web Inspector (ON)

2. **Connect iPhone to Mac via USB**

3. **Open Safari on Mac:**
   - Develop → [Your iPhone] → [localhost]
   - Console shows errors/logs from mobile

4. **Useful Console Commands:**
   ```javascript
   // Check video state
   document.querySelector('video').paused
   document.querySelector('video').readyState

   // Force play
   document.querySelector('video').play()

   // Check touch events
   document.addEventListener('touchend', e => console.log('Touch!', e))
   ```

#### iOS Simulator (Limited Touch Testing)

```bash
# Install Xcode from App Store
# Open Simulator
open -a Simulator

# In Simulator: Safari → http://localhost:3000
# Note: Simulates touch but not all hardware behaviors
```

### Android Chrome Testing

#### Remote Debugging (Chrome Desktop + Android)

1. **Enable Developer Options on Android:**
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → USB Debugging (ON)

2. **Connect Android to Computer via USB**

3. **Open Chrome on Desktop:**
   - Navigate to `chrome://inspect`
   - Find your device
   - Click "Inspect" on localhost:3000

4. **DevTools shows:**
   - Console logs from mobile
   - Network requests
   - Performance metrics

## Testing Checklist

### Basic Touch Interaction

| Test | iOS Safari | Android Chrome | Desktop |
|------|-----------|----------------|---------|
| Single tap toggles play/pause | ☐ | ☐ | ☐ |
| Overlay shows on tap | ☐ | ☐ | ☐ |
| Overlay fades after 1 second | ☐ | ☐ | ☐ |
| Correct icon (play vs pause) | ☐ | ☐ | ☐ |
| No double-tap zoom | ☐ | ☐ | N/A |
| No fullscreen on tap | ☐ | ☐ | N/A |

### Scroll Interaction

| Test | iOS Safari | Android Chrome | Desktop |
|------|-----------|----------------|---------|
| Video autoplays at 50% visible | ☐ | ☐ | ☐ |
| Video pauses at 20% visible | ☐ | ☐ | ☐ |
| Manual play prevents auto-pause | ☐ | ☐ | ☐ |
| Manual pause prevents auto-play | ☐ | ☐ | ☐ |
| Smooth scroll performance | ☐ | ☐ | ☐ |

### Edge Cases

| Test | iOS Safari | Android Chrome | Desktop |
|------|-----------|----------------|---------|
| Tap while loading | ☐ | ☐ | ☐ |
| Rapid double-tap (debounce) | ☐ | ☐ | N/A |
| Play during slow network | ☐ | ☐ | ☐ |
| Rotate device (portrait ↔ landscape) | ☐ | ☐ | N/A |
| Background tab (pause expected) | ☐ | ☐ | ☐ |

### iOS Specific

| Test | Result |
|------|--------|
| Works in Low Power Mode | ☐ |
| Poster shows until first tap | ☐ |
| playsInline prevents fullscreen | ☐ |
| Muted autoplay allowed | ☐ |
| iOS 15+ compatibility | ☐ |
| iOS 16+ compatibility | ☐ |
| iOS 17+ compatibility | ☐ |

### Accessibility

| Test | iOS Safari | Android Chrome | Desktop |
|------|-----------|----------------|---------|
| Keyboard Space/Enter works | N/A | N/A | ☐ |
| Focus indicator visible | N/A | N/A | ☐ |
| Screen reader announces state | ☐ | ☐ | ☐ |
| Touch target size adequate | ☐ | ☐ | N/A |

### Performance

| Test | iOS Safari | Android Chrome | Desktop |
|------|-----------|----------------|---------|
| No scroll jank | ☐ | ☐ | ☐ |
| No layout shift on tap | ☐ | ☐ | ☐ |
| Smooth overlay animation | ☐ | ☐ | ☐ |
| Memory stable (no leaks) | ☐ | ☐ | ☐ |

## Common Issues & Solutions

### Issue: Double-Tap Zoom Occurs

**Symptoms:** Tapping video twice zooms the page

**Solution:**
- Verify `preventDefault()` is called in touch handler
- Check `touch-none` class is on wrapper div
- Increase debounce threshold from 300ms

**Debug:**
```javascript
// Add to handleVideoTap
console.log('Tap debounce:', timeSinceLastTap);
```

### Issue: Fullscreen Triggers on iOS

**Symptoms:** Video goes fullscreen on tap

**Solution:**
- Ensure `playsInline` attribute on `<video>`
- Verify `preventDefault()` on touch events
- Check iOS Safari version (15+)

**Debug:**
```javascript
// Check video attributes
const video = document.querySelector('video');
console.log('playsInline:', video.hasAttribute('playsinline'));
```

### Issue: Overlay Doesn't Show

**Symptoms:** No visual feedback on tap

**Solution:**
- Check overlay state in React DevTools
- Verify timeout is set correctly
- Inspect overlay div z-index

**Debug:**
```javascript
// Add to showOverlay
console.log('Showing overlay:', iconType);
console.log('Timeout ID:', overlayTimeoutRef.current);
```

### Issue: Autoplay Conflicts with Manual Play

**Symptoms:** Video pauses unexpectedly after manual play

**Solution:**
- Verify `respectManualPause: true` in hook options
- Check `userPausedRef` state
- Ensure play/pause calls use hook methods

**Debug:**
```javascript
// Enable debug mode in useVideoIntersection
debug: true
```

### Issue: Video Won't Play on iOS

**Symptoms:** Play button shows but video doesn't start

**Possible Causes:**
1. **Unmuted video** - iOS blocks unmuted autoplay
   - Check: `video.muted === true`

2. **Low Power Mode** - iOS restricts autoplay
   - Test: Manual play should still work

3. **Network error** - Video file unavailable
   - Check: Network tab in Safari Web Inspector

4. **Incorrect MIME type** - Server not sending video/mp4
   - Check: Response headers

**Debug:**
```javascript
video.play()
  .then(() => console.log('Play succeeded'))
  .catch(err => console.error('Play failed:', err.name, err.message));
```

## Performance Testing

### FPS Monitoring

```javascript
// Add to component for FPS tracking
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log('FPS:', frames);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}

measureFPS();
```

### Memory Monitoring

**Chrome DevTools (Desktop & Android):**
1. Performance tab → Record
2. Scroll up/down through videos
3. Stop recording
4. Check memory timeline - should be stable

**Safari Web Inspector (iOS):**
1. Timelines tab → Memory
2. Record while scrolling
3. Look for memory leaks (increasing baseline)

### Network Performance

**Test on 3G Network:**
```javascript
// Chrome DevTools → Network → Throttling → Slow 3G
// Test:
// - Video preloading strategy
// - Play button responsiveness
// - Loading indicator appears
```

## Automated Testing

### Playwright Mobile Testing

```javascript
// tests/mobile-video.spec.ts
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Video Touch', () => {
  test.use(devices['iPhone 13']);

  test('should toggle play/pause on tap', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const video = page.locator('video').first();

    // Wait for video to be visible
    await video.waitFor({ state: 'visible' });

    // Tap video
    await video.tap();

    // Check if playing
    const isPlaying = await video.evaluate(v => !v.paused);
    expect(isPlaying).toBe(true);

    // Tap again
    await video.tap();

    // Check if paused
    const isPaused = await video.evaluate(v => v.paused);
    expect(isPaused).toBe(true);
  });

  test('should show overlay on tap', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const video = page.locator('video').first();
    await video.tap();

    // Check overlay visibility
    const overlay = page.locator('[aria-hidden="true"]').filter({ hasText: '' }).first();
    await expect(overlay).toBeVisible();

    // Wait for fade out
    await page.waitForTimeout(1200);
    await expect(overlay).not.toBeVisible();
  });
});
```

### Run Tests

```bash
# Install Playwright
npm install -D @playwright/test

# Run mobile tests
npx playwright test --project="iPhone 13"
npx playwright test --project="Pixel 7"

# Debug mode
npx playwright test --debug
```

## Real Device Testing Matrix

### Minimum Test Coverage

| Device | OS | Browser | Priority |
|--------|-----|---------|----------|
| iPhone 13/14/15 | iOS 17 | Safari | HIGH |
| iPhone SE | iOS 16 | Safari | MEDIUM |
| iPad Air | iOS 17 | Safari | MEDIUM |
| Samsung Galaxy S23 | Android 14 | Chrome | HIGH |
| Google Pixel 7 | Android 14 | Chrome | HIGH |
| Samsung Galaxy Tab | Android 13 | Chrome | LOW |

### Testing Services

**BrowserStack** (Recommended)
- Real device testing
- Screen recordings
- Network throttling
- iOS + Android coverage

**Sauce Labs**
- Similar to BrowserStack
- Good for CI/CD integration

**Device Farm (AWS)**
- Pay-per-use model
- Good for one-off testing

## Reporting Issues

### Issue Template

```markdown
**Device:** iPhone 14 Pro
**OS:** iOS 17.2
**Browser:** Safari 17.2
**Network:** 4G LTE

**Steps to Reproduce:**
1. Load page with river videos
2. Scroll to video at 50% viewport
3. Tap video once

**Expected Behavior:**
Video should start playing and show pause icon overlay

**Actual Behavior:**
Video starts but overlay doesn't appear

**Console Logs:**
[paste any errors from Safari Web Inspector]

**Screenshot/Video:**
[attach if possible]
```

### Debug Information to Include

```javascript
// Run this in console and include output
console.log({
  userAgent: navigator.userAgent,
  videoElement: {
    paused: document.querySelector('video').paused,
    readyState: document.querySelector('video').readyState,
    networkState: document.querySelector('video').networkState,
    error: document.querySelector('video').error,
  },
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
  },
  features: {
    touchSupported: 'ontouchstart' in window,
    intersectionObserver: 'IntersectionObserver' in window,
  }
});
```

---

**Last Updated:** 2025-11-13
**For Questions:** Contact mobile development team
