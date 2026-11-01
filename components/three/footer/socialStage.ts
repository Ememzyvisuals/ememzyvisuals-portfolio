// components/three/footer/socialStage.ts
// The social icons as glossy 3D tiles hanging on strings from a brass rail along the top of the footer.
// Brush across them and they swing and knock into each other. Click one to open the profile.
import * as THREE from "three";
import { polishRenderer, polishLight } from "@/components/three/polish";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type Social = { label: string; href: string; color: string };
export type SocialApi = { dispose: () => void };

export function mountSocial(el: HTMLElement, items: Social[], opts: { onReady: () => void; onFail: () => void }): SocialApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch { opts.onFail(); return { dispose() {} }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  polishRenderer(renderer);
  el.appendChild(renderer.domElement);
  const cv = renderer.domElement;
  cv.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
  camera.position.set(0, -0.6, 18);
  camera.lookAt(0, -0.9, 0);
  const key = new THREE.DirectionalLight(0xffffff, 1.3);
  key.position.set(-4, 6, 8);
  key.castShadow = true;
  polishLight(key);
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -10, right: 10, top: 4, bottom: -5, near: 1, far: 30 });
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x666666, 0.35));

  // a catcher for the soft shadows the tiles throw on the footer behind them
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), new THREE.ShadowMaterial({ opacity: 0.07 }));
  catcher.position.set(0, -1, -0.8);
  catcher.receiveShadow = true;
  scene.add(catcher);

  const atlas = new THREE.TextureLoader().load("/models/footer/social.webp", () => { if (alive) { started = true; opts.onReady(); kick(); } }, undefined, () => opts.onFail());
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const mBrass = new THREE.MeshPhysicalMaterial({ color: 0xcfa862, metalness: 0.95, roughness: 0.25 });
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 40, 16).rotateZ(Math.PI / 2), mBrass);
  rail.castShadow = true;
  scene.add(rail);

  const S = 1.15; // tile size
  const body = new RoundedBoxGeometry(S, S, 0.3, 5, 0.2);
  const face = new THREE.PlaneGeometry(S * 0.86, S * 0.86);
  const mString = new THREE.LineBasicMaterial({ color: 0x8a8a8a });
  type Tile = { group: THREE.Group; ring: THREE.Mesh; line: THREE.Line; x0: number; L: number; a: number; va: number; b: number; vb: number; href: string; i: number; hover: number };
  const tiles: Tile[] = [];
  items.forEach((it, i) => {
    const group = new THREE.Group();
    const m = new THREE.MeshPhysicalMaterial({ color: it.color, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 });
    const b = new THREE.Mesh(body, m);
    b.castShadow = true;
    group.add(b);
    for (const side of [1, -1]) {
      const t = atlas.clone();
      t.repeat.set(1 / items.length, 1);
      t.offset.set(i / items.length, 0);
      t.needsUpdate = true;
      const f = new THREE.Mesh(face, new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 }));
      f.position.z = side * 0.152;
      if (side < 0) f.rotation.y = Math.PI;
      group.add(f);
    }
    // a small brass ring at the top where the string ties on
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 10, 24), mBrass);
    ring.position.y = S / 2 + 0.08;
    group.add(ring);
    group.traverse((o) => (o.userData.tile = i));
    scene.add(group);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), mString);
    scene.add(line);
    tiles.push({ group, ring, line, x0: 0, L: 0.75 + ((i * 37) % 5) * 0.14, a: 0, va: 0, b: 0, vb: 0, href: it.href, i, hover: 0 });
  });

  // spread the tiles across the visible width
  let halfW = 8;
  const layout = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    // keep the tiles the same size on screen whatever the width: show a fixed 4.4 units of height
    const vh = 4.4;
    camera.position.z = vh / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.y = -0.2;
    camera.lookAt(0, -0.2, 0);
    camera.updateProjectionMatrix();
    halfW = (vh * camera.aspect) / 2;
    const span = Math.min(halfW * 2 - 1.2, tiles.length * 2.3);
    tiles.forEach((t, i) => (t.x0 = -span / 2 + (span * (i + 0.5)) / tiles.length));
    rail.position.y = vh / 2 - 0.45;
  };
  const ro = new ResizeObserver(layout);
  ro.observe(el);
  layout();

  const tileX = (t: Tile) => t.x0 + Math.sin(t.a) * t.L;
  const kick = () => tiles.forEach((t, i) => setTimeout(() => alive && (t.va += (i % 2 ? -1 : 1) * 0.9), 200 + i * 70));

  /* pointer: brushing across pushes the tiles; a click opens the profile */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let lastX = 0, lastT = 0, hovered: Tile | null = null;
  const hit = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const h = ray.intersectObjects(tiles.map((t) => t.group), true)[0];
    return h ? tiles[h.object.userData.tile as number] : null;
  };
  const onMove = (e: PointerEvent) => {
    const now = performance.now();
    const vx = (e.clientX - lastX) / Math.max(8, now - lastT);
    lastX = e.clientX; lastT = now;
    const t = hit(e);
    if (t && t !== hovered) { t.va += THREE.MathUtils.clamp(vx * 3, -3, 3) || 0.8; t.vb += vx * 4; }
    hovered = t;
    cv.style.cursor = t ? "pointer" : "default";
  };
  let down = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY }; lastX = e.clientX; lastT = performance.now(); };
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return;
    const t = hit(e);
    if (!t) return;
    t.va += 2.2; t.vb += 6;
    setTimeout(() => window.open(t.href, "_blank", "noopener,noreferrer"), 180);
  };
  const onLeave = () => (hovered = null);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointerleave", onLeave);

  let raf = 0, last = performance.now(), started = false, alive = true;
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!started) return;
    const g = 9.8;
    for (const t of tiles) {
      t.va += (-(g / t.L) * Math.sin(t.a) - 0.9 * t.va) * dt;
      t.a = THREE.MathUtils.clamp(t.a + t.va * dt, -1.1, 1.1);
      t.vb += (-14 * t.b - 1.2 * t.vb) * dt; // twist on the string
      t.b += t.vb * dt;
    }
    // neighbours knock into each other
    for (let k = 0; k < 2; k++) for (let i = 1; i < tiles.length; i++) {
      const A = tiles[i - 1], B = tiles[i];
      const gap = tileX(B) - tileX(A) - S * 1.02;
      if (gap < 0) {
        const push = -gap / 2;
        A.a = Math.asin(THREE.MathUtils.clamp((tileX(A) - push - A.x0) / A.L, -0.99, 0.99));
        B.a = Math.asin(THREE.MathUtils.clamp((tileX(B) + push - B.x0) / B.L, -0.99, 0.99));
        const va = A.va * A.L, vb = B.va * B.L;
        if (va > vb) { A.va = (vb * 0.85) / A.L; B.va = (va * 0.85) / B.L; A.vb += 2; B.vb -= 2; }
      }
    }
    for (const t of tiles) {
      const top = new THREE.Vector3(t.x0, rail.position.y, 0);
      const cx = t.x0 + Math.sin(t.a) * t.L, cy = rail.position.y - Math.cos(t.a) * t.L;
      t.group.position.set(cx, cy - S / 2 - 0.16, 0);
      t.group.rotation.set(0, t.b + Math.sin(now / 1300 + t.i) * 0.06, t.a);
      // keep the tile hanging below its string: rotate about the tie point
      const tie = new THREE.Vector3(0, S / 2 + 0.16, 0).applyEuler(t.group.rotation);
      t.group.position.set(cx - tie.x, cy - tie.y, -tie.z);
      const p = t.line.geometry.attributes.position as THREE.BufferAttribute;
      p.setXYZ(0, top.x, top.y, 0); p.setXYZ(1, cx, cy, 0); p.needsUpdate = true;
    }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh || (o as THREE.Line).isLine) { m.geometry.dispose(); const mm = m.material as THREE.Material; mm?.dispose?.(); } });
      atlas.dispose();
      pmrem.dispose();
      renderer.dispose();
      cv.remove();
    },
  };
}
