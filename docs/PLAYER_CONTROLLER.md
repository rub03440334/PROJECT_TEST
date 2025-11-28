# PlayerController Implementation

## Overview
The PlayerController module implements smooth, frame-rate independent lane-based horizontal movement for the player cube using velocity-based interpolation with configurable bounds clamping.

## Key Features

### 1. Lane-based Movement
- Configurable number of lanes (default: 3)
- Adjustable lane spacing/width (default: 2 units)
- Automatic lane position calculation centered at origin
- Edge-case handling for single lane configurations

### 2. Velocity-based Interpolation
- Smooth exponential damping for natural acceleration/deceleration
- Frame-rate independent movement using deltaTime
- Configurable max horizontal speed (default: 12 units/s)
- Configurable velocity blend/smoothing factor (default: 10)

### 3. Bounds Clamping
- Automatic bounds calculation from lane positions
- Manual bounds override option
- Clamps both target lane positions and intermediate interpolation
- Prevents player from leaving track boundaries

### 4. Input Intent System
- Decoupled from direct keyboard events
- Boolean intent flags: `moveLeft` and `moveRight`
- Supports edge-triggered lane switching (press to move one lane)
- Prevents accidental multi-lane jumps

### 5. Reusable Entity Design
- Wraps existing Player entity mesh
- Provides `getMesh()` for collision detection
- Proper disposal/cleanup via `dispose()` method
- Can be easily extended for obstacle collision handling

## API

### PlayerController Constructor
```typescript
new PlayerController(engine: GameEngine, options?: PlayerControllerOptions)
```

#### Options
- `laneCount`: Number of lanes (default: 3)
- `laneWidth`: Spacing between lanes (default: 2)
- `maxHorizontalSpeed`: Max velocity in units/second (default: 12)
- `velocityBlend`: Smoothing factor for damping (default: 10)
- `initialLaneIndex`: Starting lane (default: center lane)
- `initialY`: Starting Y position (default: from Player entity)
- `initialZ`: Starting Z position (default: 0)
- `bounds`: Manual override for horizontal bounds

### PlayerController Methods
- `update(deltaTime: number, intents: PlayerIntents)`: Update player position
- `getMesh()`: Get the underlying Three.js mesh for rendering/collisions
- `dispose()`: Clean up and remove from scene

### PlayerIntents Interface
```typescript
interface PlayerIntents {
  moveLeft: boolean;
  moveRight: boolean;
}
```

## Implementation Details

### Movement Algorithm
1. **Intent Processing**: Edge detection on intent flags to trigger lane changes
2. **Target Calculation**: Calculate target X position from lane index with bounds clamping
3. **Velocity Damping**: Smooth velocity towards desired velocity using exponential decay
4. **Position Update**: Apply velocity with deltaTime, prevent overshoot
5. **Bounds Enforcement**: Final clamp to ensure position stays within bounds

### Damping Function
Uses exponential smoothing for natural deceleration:
```
t = 1 - exp(-smoothing * deltaTime)
velocity = lerp(currentVelocity, desiredVelocity, t)
```

This ensures:
- Frame-rate independence
- Smooth acceleration/deceleration curves
- No oscillation or overshoot

## Usage Example
```typescript
const playerController = new PlayerController(gameEngine, {
  laneCount: 3,
  laneWidth: 3,
  maxHorizontalSpeed: 12,
  velocityBlend: 10,
});

const inputIntents: PlayerIntents = {
  moveLeft: false,
  moveRight: false,
};

// In game loop
gameEngine.render((_engine, deltaTime) => {
  playerController.update(deltaTime, inputIntents);
});

// On cleanup
playerController.dispose();
```

## Testing
The implementation satisfies all acceptance criteria:
- ✅ Cube moves smoothly left/right within bounds
- ✅ Movement uses intention flags (not direct key events)
- ✅ Frame-rate independent motion via deltaTime
- ✅ Velocity-based interpolation with configurable parameters
- ✅ Bounds clamping prevents leaving track
- ✅ Reusable entity design for future collision detection
