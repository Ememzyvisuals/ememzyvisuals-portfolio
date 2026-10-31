// components/three/abacus/abacusStage.ts
// A real wooden abacus where every bead carries the logo of a tool I use.
// Tap a bead and it slides along its brass rod, pushing its neighbours with it, like a real abacus.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type AbacusApi = { dispose: () => void };

const RODS = 4, PER = 8, BEAD_W = 0.62, ROD_LEN = 8.4, GAP = 1.45;
const ROW_Y = (i: number) => (1.5 - i) * GAP;

export function mountAbacus(el: HTMLElement, opts: { onReady: () => void; onFail: () => void }): AbacusApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch { opts.onFail(); return { dispose() {} }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  el.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.45;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  const key = new THREE.DirectionalLight(0xfff1dd, 2.4);
  key.position.set(-4, 8, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 5, bottom: -5, near: 1, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key, new THREE.HemisphereLight(0xfff6ea, 0x3a2a1e, 0.6));
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0.8);
  rim.position.set(6, 3, -6);
  scene.add(rim);

  const loader = new THREE.TextureLoader();
  let pending = 0, alive = true;
  const tex = (name: string, color: boolean) => {
    pending++;
    const t = loader.load(`/models/chess/${name}.webp`, () => { if (--pending === 0 && alive) start(); }, undefined, () => opts.onFail());
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const walnut = { map: tex("black_walnut_diff", true), normalMap: tex("black_walnut_nor", false) };
  const ash = { map: tex("ash_diff", true), normalMap: tex("ash_nor", false) };
  const atlas = tex("logos", true);
  atlas.wrapS = atlas.wrapT = THREE.ClampToEdgeWrapping;

  const mFrame = new THREE.MeshPhysicalMaterial({ ...walnut, color: 0x7a5d4a, roughness: 0.42, clearcoat: 0.9, clearcoatRoughness: 0.18, normalScale: new THREE.Vector2(0.3, 0.3) });
  const mBrass = new THREE.MeshPhysicalMaterial({ color: 0xd2ad6c, metalness: 0.92, roughness: 0.24 });
  // bead woods alternate by row: honey ash, walnut, honey ash, walnut
  const mBeadL = new THREE.MeshPhysicalMaterial({ ...ash, color: 0xf3d7ae, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08, normalScale: new THREE.Vector2(0.2, 0.2) });
  const mBeadD = new THREE.MeshPhysicalMaterial({ ...walnut, color: 0xa47e64, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08, normalScale: new THREE.Vector2(0.2, 0.2) });
  const mEnamel = new THREE.MeshPhysicalMaterial({ color: 0xfbf7ef, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.06 });

  /* frame: two thick end posts, top and bottom rails, feet */
  const frame = new THREE.Group();
  scene.add(frame);
  const box = (w: number, h: number, d: number, x: number, y: number, z = 0) => {
    const g = new THREE.BoxGeometry(w, h, d, 1, 1, 1);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w * 0.12, uv.getY(i) * h * 0.12);
    const m = new THREE.Mesh(g, mFrame);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    frame.add(m);
    return m;
  };
  const halfW = ROD_LEN / 2 + 0.35, halfH = 1.5 * GAP + 0.95;
  box(0.7, halfH * 2 + 0.7, 0.9, -halfW, 0);
  box(0.7, halfH * 2 + 0.7, 0.9, halfW, 0);
  box(halfW * 2 + 0.7, 0.5, 0.9, 0, halfH);
  box(halfW * 2 + 0.7, 0.5, 0.9, 0, -halfH);
  box(1.6, 0.25, 1.6, -halfW, -halfH - 0.45);
  box(1.6, 0.25, 1.6, halfW, -halfH - 0.45);
  // brass corner caps
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 14), mBrass);
    c.position.set(sx * halfW, sy * halfH, 0.46);
    frame.add(c);
  }

  /* rods and beads */
  const beadProfile: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / 24;
    const r = 0.17 + 0.4 * Math.pow(Math.cos(a), 0.7);
    beadProfile.push(new THREE.Vector2(r, Math.sin(a) * (BEAD_W / 2 - 0.01)));
  }
  const beadGeo = new THREE.LatheGeometry(beadProfile, 48).rotateZ(Math.PI / 2);
  const badgeGeo = new THREE.CircleGeometry(0.3, 40);
  const ringGeo = new THREE.RingGeometry(0.3, 0.335, 40);
  const logoMats: THREE.MeshStandardMaterial[] = [];

  type Bead = { mesh: THREE.Group; rod: number; i: number; x: number; target: number; v: number };
  const beads: Bead[][] = [];
  const minX = -ROD_LEN / 2 + BEAD_W / 2, maxX = ROD_LEN / 2 - BEAD_W / 2;
  for (let r = 0; r < RODS; r++) {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, ROD_LEN + 0.7, 16).rotateZ(Math.PI / 2), mBrass);
    rod.position.y = ROW_Y(r);
    rod.castShadow = true;
    frame.add(rod);
    beads.push([]);
    for (let i = 0; i < PER; i++) {
      const g = new THREE.Group();
      const b = new THREE.Mesh(beadGeo, r % 2 === 0 ? mBeadL : mBeadD);
      b.castShadow = b.receiveShadow = true;
      g.add(b);
      const t = atlas.clone();
      const idx = r * PER + i;
      t.repeat.set(1 / 8, 1 / 4);
      t.offset.set((idx % 8) / 8, 1 - (Math.floor(idx / 8) + 1) / 4);
      t.needsUpdate = true;
      const lm = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.35, depthWrite: false });
      logoMats.push(lm);
      const face = new THREE.Mesh(badgeGeo, mEnamel);
      face.position.z = 0.575;
      const logo = new THREE.Mesh(badgeGeo, lm);
      logo.position.z = 0.58;
      logo.scale.setScalar(1.1);
      const ring = new THREE.Mesh(ringGeo, mBrass);
      ring.position.z = 0.576;
      g.add(face, logo, ring);
      g.position.y = ROW_Y(r);
      g.userData.bead = [r, i];
      g.traverse((c) => (c.userData.bead = [r, i]));
      frame.add(g);
      // start packed at the far left, then the intro spreads them into a neat left-packed row
      const home = minX + i * BEAD_W;
      beads[r].push({ mesh: g, rod: r, i, x: minX + i * 0.02 - 3, target: home, v: 0 });
    }
  }

  // contact shadow under the abacus
  const sh = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d")!, gr = x.createRadialGradient(64, 64, 10, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,0.45)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(14, 3), new THREE.MeshBasicMaterial({ map: sh, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -halfH - 0.58;
  scene.add(shadow);

  /* tap: slide this bead and everything on its far side to the other end, like counting */
  function tap(r: number, i: number) {
    const row = beads[r];
    const b = row[i];
    const leftHome = minX + i * BEAD_W;
    const onLeft = Math.abs(b.target - leftHome) < 0.01;
    if (onLeft) for (let j = i; j < PER; j++) row[j].target = maxX - (PER - 1 - j) * BEAD_W;
    else for (let j = 0; j <= i; j++) row[j].target = minX + j * BEAD_W;
  }

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hover: [number, number] | null = null;
  const hit = (e: PointerEvent): [number, number] | null => {
    const b = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const h = ray.intersectObjects(beads.flat().map((x) => x.mesh), true)[0];
    return h ? (h.object.userData.bead as [number, number]) : null;
  };
  const tilt = new THREE.Vector2(), tiltS = new THREE.Vector2();
  const onMove = (e: PointerEvent) => {
    const b = renderer.domElement.getBoundingClientRect();
    tilt.set(((e.clientX - b.left) / b.width) * 2 - 1, ((e.clientY - b.top) / b.height) * 2 - 1);
    if (e.pointerType === "mouse") { hover = hit(e); renderer.domElement.style.cursor = hover ? "pointer" : "default"; }
  };
  let down = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
  const onUp = (e: PointerEvent) => { if (Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8) { const h = hit(e); if (h) tap(h[0], h[1]); } };
  const onLeave = () => { hover = null; tilt.set(0, 0); };
  const cv = renderer.domElement;
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointerleave", onLeave);

  let portrait = false;
  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    portrait = w / h < 1;
    camera.fov = portrait ? 46 : 30;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  let raf = 0, last = performance.now(), started = false, intro = 0, shake = 0;
  function start() {
    started = true;
    opts.onReady();
    // after the beads arrive, push a couple across so it looks like someone was counting
    setTimeout(() => { tap(1, 5); tap(3, 3); }, 2200);
  }
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!started) return;
    intro = Math.min(1, intro + dt * 0.5);
    const e = 1 - Math.pow(1 - intro, 3);
    tiltS.lerp(tilt, 1 - Math.exp(-dt * 4));
    const t = now / 1000;
    const dist = portrait ? 14.5 : 18;
    const yaw = -0.32 + (1 - e) * -0.5 + tiltS.x * 0.1 + Math.sin(t * 0.2) * 0.02;
    const pitch = 0.12 + tiltS.y * 0.05;
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist + 0.3, Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(portrait ? 0 : -0.4, -0.3, 0);
    if (portrait) frame.rotation.z = 0; // same layout, closer camera does the work

    // bead physics: spring toward target, beads on a rod cannot pass through each other
    for (const row of beads) {
      for (const b of row) {
        const k = 60, d = 11;
        b.v += ((b.target - b.x) * k - b.v * d) * dt;
        b.x += b.v * dt;
      }
      for (let pass = 0; pass < 3; pass++) for (let i = 1; i < row.length; i++) {
        const a = row[i - 1], b = row[i];
        const overlap = a.x + BEAD_W - b.x;
        if (overlap > 0) {
          const hitSpeed = Math.abs(a.v - b.v);
          if (hitSpeed > 2.5) shake = Math.min(1, shake + hitSpeed * 0.02);
          a.x -= overlap / 2; b.x += overlap / 2;
          const avg = (a.v + b.v) / 2; a.v = b.v = avg;
        }
      }
      for (const b of row) {
        b.x = Math.min(maxX, Math.max(minX, b.x));
        const isHover = hover && hover[0] === b.rod && hover[1] === b.i;
        b.mesh.position.x = b.x;
        b.mesh.position.z += ((isHover ? 0.18 : 0) - b.mesh.position.z) * (1 - Math.exp(-dt * 12));
      }
    }
    shake = Math.max(0, shake - dt * 4);
    frame.position.x = Math.sin(t * 90) * shake * 0.02;
    frame.rotation.y = -0.05 * (1 - e);
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
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) m.geometry.dispose(); });
      logoMats.forEach((m) => { m.map?.dispose(); m.dispose(); });
      [mFrame, mBrass, mBeadL, mBeadD, mEnamel].forEach((m) => m.dispose());
      [walnut.map, walnut.normalMap, ash.map, ash.normalMap, atlas].forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      cv.remove();
    },
  };
}
