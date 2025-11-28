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

## Development

Start the development server with hot module reloading:

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`.

The dev server provides:
- Hot module replacement (HMR) for instant updates
- Full Three.js scene with debug info overlay
- FPS counter and performance monitoring

## Building

Build the project for production:

```bash
npm run build
```

The compiled output will be in the `dist/` directory, optimized for performance with:
- Tree-shaking for unused code removal
- Minification
- Source maps for debugging

## Preview

Preview the production build locally:

```bash
npm run preview
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint code quality checks |
| `npm run format` | Format code with Prettier |

## Development Workflow

### Type Checking

Ensure type safety before building:

```bash
npm run type-check
```

### Code Quality

Check for linting issues:

```bash
npm run lint
```

### Formatting

Auto-format code to maintain consistency:

```bash
npm run format
```

## Architecture

### GameEngine

The core engine (`src/engine/GameEngine.ts`) handles:
- Scene setup and management
- Camera configuration
- Renderer initialization with shadow support
- Responsive canvas resizing
- Animation loop management

### Entities

Game objects inherit from base entity patterns:
- **Player** (`src/entities/Player.ts`): Main player character with rotation
- **Ground** (`src/entities/Ground.ts`): Game plane

### Debug Utilities

The `DebugHelper` provides real-time performance metrics:
- FPS counter
- Canvas resolution
- Device pixel ratio
- Current time

## Configuration

### Vite Config

Edit `vite.config.ts` to customize:
- Development server port (default: 3000)
- Build target (ES2020)
- Source map generation

### TypeScript Config

Modify `tsconfig.json` to adjust:
- Compilation target
- Module resolution
- Strict type checking

### ESLint & Prettier

Configure code quality in:
- `.eslintrc.json`: Linting rules
- `.prettierrc.json`: Formatting preferences

## Performance Optimization

The engine is pre-configured with:
- **Pixel ratio clamping** (max 2.0) for high-DPI displays
- **Antialiasing** enabled for smooth rendering
- **Frustum culling** for rendering only visible objects
- **Shadow mapping** with 2048x2048 resolution
- **Fog** for distant object optimization
- **requestAnimationFrame** for frame-synchronized animation

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### No canvas appears
- Ensure the HTML contains `<div id="app"></div>`
- Check browser console for errors

### Low FPS
- Reduce object count
- Lower shadow map resolution
- Disable antialiasing in GameEngine config

### Port already in use
- Change port in `vite.config.ts` server config
- Or kill existing process: `lsof -ti:3000 | xargs kill -9`

## License

MIT

## Contributing

When adding new features:
1. Follow the existing code style (enforced by ESLint/Prettier)
2. Add TypeScript types for all functions
3. Place new entities in `src/entities/`
4. Place new systems in `src/systems/`
5. Test with `npm run type-check` before committing
