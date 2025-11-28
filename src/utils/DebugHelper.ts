import { IUpdatable } from '../engine/IUpdatable';

export class DebugHelper implements IUpdatable {
  private debugElement: HTMLElement | null;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 0;

  constructor() {
    this.debugElement = document.getElementById('debug');
  }

  public update(_deltaTime: number): void {
    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.render();
  }

  private render(): void {
    if (!this.debugElement) return;

    const now = new Date();
    const time = now.toLocaleTimeString();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio.toFixed(2);

    const html = `
      <div>FPS: ${this.fps}</div>
      <div>Resolution: ${width}x${height}</div>
      <div>Pixel Ratio: ${pixelRatio}</div>
      <div>Time: ${time}</div>
    `;

    this.debugElement.innerHTML = html;
  }

  public getFps(): number {
    return this.fps;
  }
}
