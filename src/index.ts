import { GameEngine } from './engine/GameEngine';
import { Ground } from './entities/Ground';
import { DebugHelper } from './utils/DebugHelper';
import { PlayerController, PlayerIntents } from './controllers/PlayerController';

const gameEngine = new GameEngine(null, {
  pixelRatioClamp: 2,
  antialias: true,
  frustumCulling: true,
});

const playerController = new PlayerController(gameEngine, {
  laneCount: 3,
  laneWidth: 3,
  maxHorizontalSpeed: 12,
  velocityBlend: 10,
});

const ground = new Ground();
const debugHelper = new DebugHelper();

gameEngine.addObject(ground.getMesh());

const inputIntents: PlayerIntents = {
  moveLeft: false,
  moveRight: false,
};

const intentKeyMap: Record<string, keyof PlayerIntents> = {
  arrowleft: 'moveLeft',
  a: 'moveLeft',
  arrowright: 'moveRight',
  d: 'moveRight',
};

const handleIntentChange = (event: KeyboardEvent, isActive: boolean): void => {
  const intentKey = intentKeyMap[event.key.toLowerCase()];

  if (!intentKey) {
    return;
  }

  event.preventDefault();
  inputIntents[intentKey] = isActive;
};

const handleKeyDown = (event: KeyboardEvent): void => {
  handleIntentChange(event, true);
};

const handleKeyUp = (event: KeyboardEvent): void => {
  handleIntentChange(event, false);
};

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

gameEngine.render((_engine, deltaTime) => {
  playerController.update(deltaTime, inputIntents);
  debugHelper.update(deltaTime);

  const targetFps = 60;
  const isPerformanceOptimal = debugHelper.getFps() >= targetFps * 0.95;

  if (!isPerformanceOptimal) {
    console.warn(`Performance warning: FPS below target (${debugHelper.getFps()}/${targetFps})`);
  }
});

window.addEventListener('beforeunload', () => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  playerController.dispose();
  gameEngine.dispose();
});
