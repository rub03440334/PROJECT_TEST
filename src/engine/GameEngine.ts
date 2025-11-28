import * as THREE from 'three';
import { StateMachine } from './StateMachine';
import { IUpdatable } from './IUpdatable';

export interface RendererConfig {
  pixelRatioClamp?: number;
  antialias?: boolean;
  frustumCulling?: boolean;
}

export enum GameState {
  BOOT = 'BOOT',
  RUNNING = 'RUNNING',
  GAME_OVER = 'GAME_OVER',
}

export class GameEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  stateMachine: StateMachine;

  private resizeObserver: ResizeObserver | null = null;
  private animationFrameId: number | null = null;
  private handleResizeBound: (() => void) | null = null;
  private updateList: IUpdatable[] = [];
  private lastFrameTime: number = performance.now();
  private fpsHistory: number[] = [];
  private isWebGLSupported: boolean = true;

  constructor(canvas?: HTMLCanvasElement | null, config?: RendererConfig) {
    this.checkWebGLSupport();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    if (!canvas) {
      const appElement = document.getElementById('app');
      if (!appElement) {
        throw new Error('App container not found');
      }
      canvas = document.createElement('canvas');
      appElement.appendChild(canvas);
    }

    this.canvas = canvas;

    const clampedPixelRatio = Math.min(
      window.devicePixelRatio,
      config?.pixelRatioClamp ?? 2
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: config?.antialias ?? true,
      alpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });

    this.renderer.setPixelRatio(clampedPixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.sortObjects = true;

    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);

    this.camera = this.setupCamera();
    this.setupLighting();
    this.setupFrustumCulling(config?.frustumCulling ?? true);
    this.handleResize();
    this.setupResizeHandler();

    this.initializeStateMachine();
  }

  private setupCamera(): THREE.PerspectiveCamera {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(
      45,
      aspect,
      0.1,
      1000
    );

    camera.position.set(0, 8, 12);
    camera.lookAt(0, 2, 0);

    return camera;
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.bias = -0.0001;

    this.scene.add(directionalLight);
  }

  private setupFrustumCulling(enabled: boolean): void {
    if (enabled) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.frustumCulled = true;
        }
      });
    }
  }

  private setupResizeHandler(): void {
    this.handleResizeBound = () => {
      this.handleResize();
    };

    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    this.resizeObserver.observe(this.canvas);
    window.addEventListener('resize', this.handleResizeBound);
    window.addEventListener('orientationchange', this.handleResizeBound);
  }

  private handleResize(): void {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }

  private checkWebGLSupport(): void {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('webgl2');

    if (!gl) {
      this.isWebGLSupported = false;
      console.error(
        'WebGL is not supported in this browser. Please use a modern browser with WebGL support.'
      );
      throw new Error('WebGL not supported');
    }

    this.isWebGLSupported = true;
    console.log('WebGL is supported');
  }

  private initializeStateMachine(): void {
    this.stateMachine = new StateMachine(GameState.BOOT);

    this.stateMachine.registerState(GameState.BOOT, {
      onEnter: () => {
        console.log(`[STATE] Entering ${GameState.BOOT}`);
      },
      onExit: () => {
        console.log(`[STATE] Exiting ${GameState.BOOT}`);
      },
    });

    this.stateMachine.registerState(GameState.RUNNING, {
      onEnter: () => {
        console.log(`[STATE] Entering ${GameState.RUNNING}`);
      },
      onExit: () => {
        console.log(`[STATE] Exiting ${GameState.RUNNING}`);
      },
    });

    this.stateMachine.registerState(GameState.GAME_OVER, {
      onEnter: () => {
        console.log(`[STATE] Entering ${GameState.GAME_OVER}`);
      },
      onExit: () => {
        console.log(`[STATE] Exiting ${GameState.GAME_OVER}`);
      },
    });

    this.stateMachine.addStateChangeListener((previous, current) => {
      console.log(`[STATE_TRANSITION] ${previous} -> ${current}`);
    });
  }

  public registerUpdatable(updatable: IUpdatable): void {
    if (!this.updateList.includes(updatable)) {
      this.updateList.push(updatable);
    }
  }

  public unregisterUpdatable(updatable: IUpdatable): void {
    const index = this.updateList.indexOf(updatable);
    if (index > -1) {
      this.updateList.splice(index, 1);
    }
  }

  public render(callback?: (engine: GameEngine, deltaTime: number) => void): void {
    let lastTime = performance.now();

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      this.updateFpsMetrics(deltaTime);

      this.updateAllUpdatables(deltaTime);

      if (callback) {
        callback(this, deltaTime);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  private updateAllUpdatables(deltaTime: number): void {
    this.updateList.forEach((updatable) => {
      updatable.update(deltaTime);
    });
  }

  private updateFpsMetrics(deltaTime: number): void {
    const fps = 1 / deltaTime;
    this.fpsHistory.push(fps);

    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    const averageFps =
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    if (this.fpsHistory.length % 60 === 0) {
      console.log(
        `[FRAME] Delta: ${deltaTime.toFixed(4)}s | Avg FPS: ${averageFps.toFixed(2)}`
      );
    }
  }

  public stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.handleResizeBound) {
      window.removeEventListener('resize', this.handleResizeBound);
      window.removeEventListener('orientationchange', this.handleResizeBound);
    }
  }

  public dispose(): void {
    this.stop();
    this.renderer.dispose();
  }

  public addObject(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public removeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
  }

  public isWebGLCapable(): boolean {
    return this.isWebGLSupported;
  }

  public getAverageFps(): number {
    if (this.fpsHistory.length === 0) return 0;
    return (
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
    );
  }
}
