// Dark cosmic studio for NOVA: deep violet dome, violet + cyan reflection
// panels so glass and titanium read against the black. Cool key light.
import { THREE, studioEnvironment } from './src/core/engine.js';

export function makeDarkStudio(renderer, scene, opts = {}) {
  const build = () => studioEnvironment(renderer, {
    top: new THREE.Color(0x1B1030).getHex(),
    bottom: 0x030208,
    panels: [
      { pos: [0, 8, 2], size: [14, 1.6], intensity: 5, color: 0xffffff },
      { pos: [-8, 2, 3], size: [1.4, 10], intensity: 7, color: 0x6C4CF1 },
      { pos: [7, 3, -1], size: [1.0, 9], intensity: 3.5, color: 0x3EC6E0 },
      { pos: [0, 2, 10], size: [9, 5], intensity: opts.front ?? 1.6, color: 0x8F7BFF },
      { pos: [0, 5, -8], size: [10, 1.4], intensity: 4, color: 0xffffff },
      { pos: [-5, -4, 5], size: [6, 1.2], intensity: 2, color: 0x6C4CF1 },
    ],
    blur: 0.035,
  });
  scene.environment = build();
  renderer.domElement.addEventListener('webglcontextrestored', () => { scene.environment = build(); });
  scene.environmentIntensity = 0.9;

  const key = new THREE.DirectionalLight(0xCFD8FF, 1.7);
  key.position.set(-3.5, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3.6, right: 3.6, top: 3.6, bottom: -3.6, near: 0.5, far: 24 });
  key.shadow.bias = -0.0002; key.shadow.normalBias = 0.004; key.shadow.radius = 2;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x6C4CF1, 2.4);
  rim.position.set(5, 2.5, -6);
  scene.add(rim, rim.target);
  const fill = new THREE.HemisphereLight(0x35255E, 0x05030A, 0.5);
  scene.add(fill);
  return { key, rim, fill };
}
