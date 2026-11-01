// components/three/polish.ts
// One clean-look pass for every 3D scene on the site: softer shadows, calmer surface detail, sharp textures,
// and smooth satin skin and fabric. Rough, gritty normal maps are toned down so surfaces read as clean and
// smooth, like a studio render, while keeping their shape and real colours.
import * as THREE from "three";

const SKIN = /skin|body|face|head/i, CLOTH = /outfit|cloth|shirt|dress|apron|fabric|wrapper|trouser|jean/i, HAIR = /hair|brow|lash|scalp/i;

export function polishRenderer(r: THREE.WebGLRenderer) {
  // soft, blurred shadow edges instead of hard stair-stepped ones
  r.shadowMap.type = THREE.VSMShadowMap;
}

export function polishLight(l: THREE.Light) {
  const s = (l as THREE.DirectionalLight).shadow;
  if (!s) return;
  s.radius = 6;
  s.blurSamples = 16;
  s.bias = -0.0002;
}

export function polishScene(root: THREE.Object3D, r: THREE.WebGLRenderer) {
  const aniso = r.capabilities.getMaxAnisotropy();
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    mats.forEach((mat, i) => {
      const s = mat as THREE.MeshStandardMaterial;
      if (!s.isMeshStandardMaterial) return;
      for (const t of [s.map, s.normalMap, s.roughnessMap, s.emissiveMap]) if (t) { t.anisotropy = aniso; t.needsUpdate = true; }
      if (s.normalMap) s.normalScale.multiplyScalar(0.4);
      const name = `${s.name} ${m.name}`;
      if (SKIN.test(name) && !HAIR.test(name)) {
        // satin skin: smooth, a soft sheen, light that wraps a little
        const p = new THREE.MeshPhysicalMaterial({ map: s.map, color: s.color, normalMap: s.normalMap, normalScale: s.normalMap ? s.normalScale.clone().multiplyScalar(0.5) : undefined,
          roughness: 0.42, metalness: 0, envMapIntensity: 1.25, sheen: 0.3, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xffd9c2), clearcoat: 0.06, clearcoatRoughness: 0.5 });
        p.name = s.name;
        if (Array.isArray(m.material)) (m.material as THREE.Material[])[i] = p; else m.material = p;
        s.dispose();
        return;
      }
      if (CLOTH.test(name)) {
        // soft fabric: a gentle sheen so folds read clean instead of flat
        const p = new THREE.MeshPhysicalMaterial({ map: s.map, color: s.color, normalMap: s.normalMap, normalScale: s.normalMap ? s.normalScale.clone() : undefined, roughness: 0.74, sheen: 0.22, sheenRoughness: 0.55, sheenColor: s.color.clone().lerp(new THREE.Color(0xffffff), 0.25) });
        p.name = s.name;
        if (Array.isArray(m.material)) (m.material as THREE.Material[])[i] = p; else m.material = p;
        s.dispose();
        return;
      }
      else if (HAIR.test(name)) {
        // clean hair edges: smooth anti-aliased cut-out instead of jagged blocks
        s.roughness = 0.55; // keep the hair cards' own transparency
      }
      else s.roughness = Math.min(s.roughness, 0.85);
      s.needsUpdate = true;
    });
  });
}
