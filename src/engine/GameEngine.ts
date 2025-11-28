import * as THREE from 'three';

export interface RendererConfig {
  pixelRatioClamp?: number;
  antialias?: boolean;
  frustumCulling?: boolean;
}

export class GameEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;

  private resizeObserver: ResizeObserver | null = null;
  private animationFrameId: number | null = null;
  private handleResizeBound: (() => void) | null = null;

  constructor(canvas?: HTMLCanvasElement | null, config?: RendererConfig) {
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

  public render(callback?: (engine: GameEngine, deltaTime: number) => void): void {
    let lastTime = performance.now();

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (callback) {
        callback(this, deltaTime);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
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
}
