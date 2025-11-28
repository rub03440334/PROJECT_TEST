import { GameEngine, GameState } from './engine/GameEngine';
import { Player } from './entities/Player';
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

gameEngine.registerUpdatable(player);
gameEngine.registerUpdatable(debugHelper);

let bootTimer = 0;
const bootDuration = 1;

gameEngine.render((_engine, deltaTime) => {
  const currentState = _engine.stateMachine.getState();

  if (currentState === GameState.BOOT) {
    bootTimer += deltaTime;
    if (bootTimer >= bootDuration) {
      _engine.stateMachine.changeState(GameState.RUNNING);
      bootTimer = 0;
    }
  }

  const targetFps = 60;
  const averageFps = _engine.getAverageFps();
  const isPerformanceOptimal = averageFps >= targetFps * 0.95;

  if (!isPerformanceOptimal && averageFps > 0) {
    console.warn(
      `Performance warning: FPS below target (${averageFps.toFixed(2)}/${targetFps})`
    );
  }
});

window.addEventListener('beforeunload', () => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  playerController.dispose();
  gameEngine.dispose();
});
