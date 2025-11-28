# Input Manager Demo

A unified input management system that abstracts desktop and mobile controls for web games.

## Features

- **Desktop Support**: A/D and Arrow Left/Right keys
- **Mobile Support**: Touch zones and swipe detection with dead-zone filtering
- **Simultaneous Input**: Handles multiple keys pressed at once
- **Debounced Events**: Prevents rapid-fire input updates
- **Touch Prevention**: Stops scrolling during touch interactions
- **Debug Visualization**: Real-time input state display
- **Event System**: Subscribe to input state changes

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser to `http://localhost:3000`

## Testing

### Automated Tests
```bash
npm run test
```

### Manual Testing
Open browser console and run:
```javascript
const runner = new ManualTestRunner();
runner.runTests();
```

### Manual Verification Steps

1. **Keyboard Input**:
   - Press `A` or `Left Arrow` → Left intent should activate
   - Press `D` or `Right Arrow` → Right intent should activate
   - Hold both `A` and `D` → Both intents should be active (PlayerController handles cancellation)

2. **Touch Input**:
   - Touch/click left half of screen → Left intent activates
   - Touch/click right half of screen → Right intent activates
   - Swipe left/right → Movement with dead-zone filtering

3. **Debug Overlay**:
   - Monitor the debug overlay in top-left corner
   - Check console logs for detailed state changes

## Architecture

### InputManager
Core class that handles all input processing:
- Keyboard event listeners (keydown/keyup)
- Touch event listeners (touchstart/touchmove/touchend)
- Mouse event listeners for desktop testing
- State management and debouncing
- Subscription system for state changes

### PlayerController
Consumes input intents to control player movement:
- Responds to left/right movement intents
- Handles simultaneous input cancellation
- Keeps player within screen bounds

### DebugOverlay
Visualizes input state for testing:
- Real-time display of intent flags
- Input type indicator
- Console logging

## File Structure

```
src/
├── InputManager.js      # Core input handling logic
├── PlayerController.js  # Player movement controller
├── DebugOverlay.js      # Debug visualization
├── main.js             # Application entry point
└── tests/
    ├── InputManager.test.js    # Automated tests
    └── ManualTestRunner.js     # Manual test utilities
```

## Input Mapping

| Input | Action | Intent |
|-------|--------|--------|
| A / Arrow Left | Move Left | `leftIntent: true` |
| D / Arrow Right | Move Right | `rightIntent: true` |
| Touch Left Zone | Move Left | `leftIntent: true` |
| Touch Right Zone | Move Right | `rightIntent: true` |
| Swipe Left | Move Left | `leftIntent: true` |
| Swipe Right | Move Right | `rightIntent: true` |

## Configuration

### Dead Zone
Default: 10 pixels
- Touch movements within this range use zone-based detection
- Movements beyond this range use swipe detection

### Swipe Threshold
Default: 30 pixels
- Minimum distance to register as a swipe

### Debounce Delay
Default: 16ms (~60fps)
- Prevents excessive input updates

## Browser Support

- Modern browsers with ES6 module support
- Touch events for mobile devices
- Mouse events for desktop testing

## Development

The project uses Vite for development and testing:
- Fast HMR (Hot Module Replacement)
- Vitest for unit testing
- JSOM environment for DOM testing