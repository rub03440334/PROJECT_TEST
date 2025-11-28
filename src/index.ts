import { GameEngine } from './engine/GameEngine';
import { Player } from './entities/Player';
import { Ground } from './entities/Ground';
import { DebugHelper } from './utils/DebugHelper';

const gameEngine = new GameEngine(null, {
  pixelRatioClamp: 2,
  antialias: true,
  frustumCulling: true,
});

const player = new Player();
const ground = new Ground();
const debugHelper = new DebugHelper();

gameEngine.addObject(player.getMesh());
gameEngine.addObject(ground.getMesh());

gameEngine.render((_engine, deltaTime) => {
  player.update(deltaTime);
  debugHelper.update(deltaTime);

  const targetFps = 60;
  const isPerformanceOptimal = debugHelper.getFps() >= targetFps * 0.95;

  if (!isPerformanceOptimal) {
    console.warn(`Performance warning: FPS below target (${debugHelper.getFps()}/${targetFps})`);
  }
});

window.addEventListener('beforeunload', () => {
  gameEngine.dispose();
});
