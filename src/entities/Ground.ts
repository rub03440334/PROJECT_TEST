import * as THREE from 'three';

export class Ground {
  mesh: THREE.Mesh;

  constructor() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.2,
      roughness: 0.8,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
}
