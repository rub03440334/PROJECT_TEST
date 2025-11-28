import * as THREE from 'three';
import { IUpdatable } from '../engine/IUpdatable';

export class Player implements IUpdatable {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;

    const geometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: options?.color ?? 0xff6b6b,
      metalness: 0.25,
      roughness: 0.8,
      flatShading: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(0, size / 2, 0);
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
