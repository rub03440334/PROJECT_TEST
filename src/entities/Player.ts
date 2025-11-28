import * as THREE from 'three';
import { IUpdatable } from '../engine/IUpdatable';

export class Player implements IUpdatable {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;

  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      metalness: 0.3,
      roughness: 0.7,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(0, 0.5, 0);

    this.velocity = new THREE.Vector3(0, 0, 0);
  }

  public update(deltaTime: number): void {
    this.mesh.rotation.z += 0.5 * deltaTime;
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
