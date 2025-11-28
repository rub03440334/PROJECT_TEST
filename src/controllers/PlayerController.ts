import * as THREE from 'three';
import { GameEngine } from '../engine/GameEngine';
import { Player } from '../entities/Player';

export interface PlayerIntents {
  moveLeft: boolean;
  moveRight: boolean;
}

export interface PlayerMovementBounds {
  minX: number;
  maxX: number;
}

export interface PlayerControllerOptions {
  laneCount?: number;
  laneWidth?: number;
  maxHorizontalSpeed?: number;
  velocityBlend?: number;
  initialLaneIndex?: number;
  initialY?: number;
  initialZ?: number;
  bounds?: PlayerMovementBounds;
}

export class PlayerController {
  private readonly player: Player;
  private readonly lanePositions: number[];
  private readonly bounds: PlayerMovementBounds;
  private readonly velocity = new THREE.Vector3();
  private readonly maxHorizontalSpeed: number;
  private readonly velocityBlend: number;

  private targetLaneIndex: number;
  private previousIntents: PlayerIntents = { moveLeft: false, moveRight: false };

  constructor(private readonly engine: GameEngine, options?: PlayerControllerOptions) {
    this.player = new Player();
    this.engine.addObject(this.player.getMesh());

    const laneCount = Math.max(1, Math.floor(options?.laneCount ?? 3));
    const laneWidth = options?.laneWidth ?? 2;
    this.lanePositions = this.createLanePositions(laneCount, laneWidth);

    this.bounds =
      options?.bounds ?? {
        minX: this.lanePositions[0],
        maxX: this.lanePositions[this.lanePositions.length - 1],
      };

    this.maxHorizontalSpeed = options?.maxHorizontalSpeed ?? 12;
    this.velocityBlend = options?.velocityBlend ?? 10;

    this.targetLaneIndex = THREE.MathUtils.clamp(
      options?.initialLaneIndex ?? Math.floor(this.lanePositions.length / 2),
      0,
      this.lanePositions.length - 1
    );

    const mesh = this.player.getMesh();
    const startX = THREE.MathUtils.clamp(
      this.lanePositions[this.targetLaneIndex],
      this.bounds.minX,
      this.bounds.maxX
    );
    const startY = options?.initialY ?? mesh.position.y;
    const startZ = options?.initialZ ?? 0;

    mesh.position.set(startX, startY, startZ);
  }

  private createLanePositions(count: number, width: number): number[] {
    if (count === 1) {
      return [0];
    }

    const positions: number[] = [];
    const halfExtent = ((count - 1) * width) / 2;

    for (let i = 0; i < count; i += 1) {
      positions.push(-halfExtent + i * width);
    }

    return positions;
  }

  public update(deltaTime: number, intents: PlayerIntents): void {
    this.consumeIntents(intents);
    this.moveTowardsLane(deltaTime);
    this.previousIntents = { ...intents };
  }

  private consumeIntents(intents: PlayerIntents): void {
    if (intents.moveLeft && !this.previousIntents.moveLeft) {
      this.targetLaneIndex = Math.max(0, this.targetLaneIndex - 1);
    } else if (intents.moveRight && !this.previousIntents.moveRight) {
      this.targetLaneIndex = Math.min(
        this.lanePositions.length - 1,
        this.targetLaneIndex + 1
      );
    }
  }

  private moveTowardsLane(deltaTime: number): void {
    const mesh = this.player.getMesh();
    const targetX = THREE.MathUtils.clamp(
      this.lanePositions[this.targetLaneIndex],
      this.bounds.minX,
      this.bounds.maxX
    );

    const deltaX = targetX - mesh.position.x;

    if (Math.abs(deltaX) < 0.0001) {
      mesh.position.x = targetX;
      this.velocity.x = 0;
      return;
    }

    const desiredVelocity = THREE.MathUtils.clamp(
      deltaX / Math.max(deltaTime, 1e-4),
      -this.maxHorizontalSpeed,
      this.maxHorizontalSpeed
    );

    this.velocity.x = this.damp(
      this.velocity.x,
      desiredVelocity,
      this.velocityBlend,
      deltaTime
    );

    let nextX = mesh.position.x + this.velocity.x * deltaTime;

    if ((deltaX > 0 && nextX > targetX) || (deltaX < 0 && nextX < targetX)) {
      nextX = targetX;
      this.velocity.x = 0;
    }

    mesh.position.x = THREE.MathUtils.clamp(nextX, this.bounds.minX, this.bounds.maxX);
  }

  private damp(current: number, target: number, smoothing: number, deltaTime: number): number {
    const t = 1 - Math.exp(-smoothing * deltaTime);
    return THREE.MathUtils.lerp(current, target, t);
  }

  public getMesh(): THREE.Mesh {
    return this.player.getMesh();
  }

  public dispose(): void {
    this.engine.removeObject(this.player.getMesh());
  }
}
