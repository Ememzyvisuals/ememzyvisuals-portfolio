// components/three/certs/wallStage.ts
// A gallery wall: each certificate in a real frame (moulding, white mount, glass) hung from a brass pin,
// with red thread running pin to pin along the order I took the courses.
// Touch a frame and it swings on its pin; the thread tugs the next frames along. Tap one to bring it close.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type WallItem = { slug: string; image: string };
export type WallApi = { dispose: () => void; close: () => void; setMode: (dark: boolean) => void };

// Where each certificate hangs (wall units), its size and a small resting tilt.
const LAYOUT: Record<string, { x: number; y: number; w: number; tilt: number }> = {
  "intro-ml": { x: -5.0, y: 1.6, w: 2.55, tilt: -0.015 },
  "intermediate-ml": { x: -1.67, y: 1.78, w: 2.55, tilt: 0.01 },
  "feature-engineering": { x: 1.67, y: 1.55, w: 2.5, tilt: -0.02 },
  "ml-explainability": { x: 5.0, y: 1.72, w: 2.5, tilt: 0.015 },
  "ibm-ai-fundamentals": { x: -3.35, y: -1.7, w: 2.25, tilt: 0.02 },
  "intro-dl": { x: 0, y: -1.55, w: 2.5, tilt: -0.012 },
  "computer-vision": { x: 3.35, y: -1.72, w: 2.5, tilt: 0.01 },
};
// Tall screens: two columns.
const LAYOUT_TALL: Record<string, { x: number; y: number; w: number; tilt: number }> = {
  "intro-ml": { x: -1.68, y: 4.05, w: 2.5, tilt: -0.015 },
  "intermediate-ml": { x: 1.68, y: 4.2, w: 2.5, tilt: 0.01 },
  "feature-engineering": { x: -1.68, y: 1.3, w: 2.45, tilt: -0.02 },
  "ml-explainability": { x: 1.68, y: 1.45, w: 2.45, tilt: 0.015 },
  "ibm-ai-fundamentals": { x: -1.68, y: -1.45, w: 2.2, tilt: 0.02 },
  "intro-dl": { x: 1.68, y: -1.35, w: 2.45, tilt: -0.012 },
  "computer-vision": { x: 0, y: -4.1, w: 2.5, tilt: 0.01 },
};
// The red thread: the order the courses were taken.
const LINKS: [string, string][] = [
  ["ibm-ai-fundamentals", "intro-ml"],
  ["intro-ml", "intermediate-ml"],
  ["intermediate-ml", "feature-engineering"],
  ["feature-engineering", "ml-explainability"],
  ["intro-ml", "intro-dl"],
  ["intro-dl", "computer-vision"],
];

export function mountWall(el: HTMLElement, items: WallItem[], opts: { dark: boolean; onOpen: (slug: string | null) => void; onReady: () => void; onFail: () => void }): WallApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch { opts.onFail(); return { dispose() {}, close() {}, setMode() {} }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  el.appendChild(renderer.domElement);
  const cv = renderer.domElement;
  cv.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  /* light: a soft wash plus gallery spots from above */
  const hemi = new THREE.HemisphereLight(0xfff5e8, 0x6b5a4a, 0.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff0dc, 1.6);
  key.position.set(-3, 7, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 8, bottom: -8, near: 1, far: 30 });
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.03;
  scene.add(key);
  const spots: THREE.SpotLight[] = [];
  for (const x of [-4.6, -1.5, 1.7, 4.8]) {
    const s = new THREE.SpotLight(0xffe2b8, 14, 14, 0.42, 0.75, 1.6);
    s.position.set(x, 5.6, 3.2);
    s.target.position.set(x, 0, 0);
    scene.add(s, s.target);
    spots.push(s);
  }

  /* wall */
  const loader = new THREE.TextureLoader();
  let pending = 0, alive = true;
  const load = (url: string, color: boolean, repeat = 1) => {
    pending++;
    const t = loader.load(url, () => { if (--pending === 0 && alive) start(); }, undefined, () => { if (--pending === 0 && alive) start(); });
    if (repeat !== 1) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat * 0.55); }
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const mWall = new THREE.MeshStandardMaterial({
    map: load("/models/certs/plaster_diff.webp", true, 3),
    normalMap: load("/models/certs/plaster_nor.webp", false, 3),
    normalScale: new THREE.Vector2(0.6, 0.6),
    color: 0xf3ece2,
    roughness: 0.95,
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), mWall);
  wall.position.z = -0.06;
  wall.receiveShadow = true;
  scene.add(wall);
  // skirting shadow line at the bottom of the view so the wall reads as a real wall
  const floorShade = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.0 }));
  scene.add(floorShade);

  /* frames */
  const mMould = new THREE.MeshPhysicalMaterial({ color: 0x0e0c0b, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4, envMapIntensity: 0.5 });
  const mMat = new THREE.MeshStandardMaterial({ color: 0xfbf8f2, roughness: 0.95 });
  const mGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.05, envMapIntensity: 0.7, depthWrite: false });
  const mBrass = new THREE.MeshPhysicalMaterial({ color: 0xd6b06a, metalness: 0.95, roughness: 0.22 });
  const mWire = new THREE.MeshStandardMaterial({ color: 0x8c8c8c, metalness: 0.8, roughness: 0.35 });
  const mThread = new THREE.MeshStandardMaterial({ color: 0xc0262d, roughness: 0.75 });

  type Frame = { slug: string; group: THREE.Group; pivot: THREE.Group; pin: THREE.Vector3; ang: number; vel: number; rest: number; lift: number; liftT: number; h: number; w: number };
  const frames: Frame[] = [];
  const pickables: THREE.Object3D[] = [];
  const textures: THREE.Texture[] = [];

  function frameMesh(w: number, h: number, border: number, depth: number) {
    const s = new THREE.Shape();
    const ow = w / 2 + border, oh = h / 2 + border;
    s.moveTo(-ow, -oh); s.lineTo(ow, -oh); s.lineTo(ow, oh); s.lineTo(-ow, oh); s.lineTo(-ow, -oh);
    const hole = new THREE.Path();
    hole.moveTo(-w / 2, -h / 2); hole.lineTo(-w / 2, h / 2); hole.lineTo(w / 2, h / 2); hole.lineTo(w / 2, -h / 2); hole.lineTo(-w / 2, -h / 2);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.022, bevelSegments: 3 });
    return g;
  }

  const tall = el.clientWidth / Math.max(1, el.clientHeight) < 1;
  for (const it of items) {
    const L = (tall ? LAYOUT_TALL : LAYOUT)[it.slug];
    if (!L) continue;
    const aspect = it.slug === "ibm-ai-fundamentals" ? 720 / 527 : 1200 / 740;
    const iw = L.w, ih = L.w / aspect, mat = 0.2, border = 0.11;
    const ow = iw + mat * 2, oh = ih + mat * 2;
    const pivot = new THREE.Group(); // swings around the pin
    const group = new THREE.Group(); // the framed picture, hanging below the pin
    const hangDrop = 0.42;
    pivot.position.set(L.x, L.y + oh / 2 + border + hangDrop, 0.02);
    group.position.y = -(oh / 2 + border + hangDrop);
    pivot.add(group);
    scene.add(pivot);

    const mould = new THREE.Mesh(frameMesh(ow, oh, border, 0.09), mMould);
    mould.castShadow = true;
    group.add(mould);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(ow, oh), mMat);
    back.position.z = 0.02;
    back.receiveShadow = true;
    group.add(back);
    const tex = load(it.image, true);
    textures.push(tex);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(iw, ih), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 }));
    pic.position.z = 0.03;
    group.add(pic);
    // a thin bevel line where the mount is cut
    const cut = new THREE.Mesh(new THREE.PlaneGeometry(iw + 0.03, ih + 0.03), new THREE.MeshStandardMaterial({ color: 0xe9e3d8, roughness: 1 }));
    cut.position.z = 0.025;
    group.add(cut);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(ow, oh), mGlass);
    glass.position.z = 0.1;
    group.add(glass);
    // picture wire: two strands from the frame's top corners up to the pin
    const pinLocal = new THREE.Vector3(0, oh / 2 + border + hangDrop, 0.0);
    for (const sx of [-1, 1]) {
      const a = new THREE.Vector3(sx * (ow / 2 - 0.15), oh / 2 + border - 0.02, 0.02);
      const len = a.distanceTo(pinLocal);
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, len, 6), mWire);
      wire.position.copy(a).add(pinLocal).multiplyScalar(0.5);
      wire.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pinLocal.clone().sub(a).normalize());
      group.add(wire);
    }
    // brass pin in the wall
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 20).rotateX(Math.PI / 2), mBrass);
    pin.position.set(pivot.position.x, pivot.position.y, 0.01);
    pin.castShadow = true;
    scene.add(pin);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), mBrass);
    head.position.set(pivot.position.x, pivot.position.y, 0.06);
    head.castShadow = true;
    scene.add(head);

    group.traverse((o) => (o.userData.slug = it.slug));
    pickables.push(group);
    frames.push({ slug: it.slug, group, pivot, pin: pivot.position.clone().setZ(0.07), ang: L.tilt, vel: 0, rest: L.tilt, lift: 0, liftT: 0, h: oh, w: ow });
  }
  const bySlug = (s: string) => frames.find((f) => f.slug === s)!;

  /* thread: a sagging red string between pins, re-shaped when it is tugged */
  type Thread = { a: Frame; b: Frame; mesh: THREE.Mesh; wob: number; phase: number };
  const threads: Thread[] = LINKS.filter(([a, b]) => frames.some((f) => f.slug === a) && frames.some((f) => f.slug === b)).map(([a, b]) => {
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mThread);
    mesh.castShadow = true;
    scene.add(mesh);
    return { a: bySlug(a), b: bySlug(b), mesh, wob: 0, phase: Math.random() * 6 };
  });
  const tmpPts: THREE.Vector3[] = [];
  function shapeThread(t: Thread, time: number) {
    const A = t.a.pin, B = t.b.pin;
    const len = A.distanceTo(B);
    const sag = 0.18 + len * 0.045;
    tmpPts.length = 0;
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const p = new THREE.Vector3().lerpVectors(A, B, u);
      const bump = Math.sin(Math.PI * u);
      p.y -= sag * bump + Math.sin(time * 18 + t.phase + u * 9) * t.wob * 0.12 * bump;
      p.z = -0.035 + bump * 0.01;
      tmpPts.push(p);
    }
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tmpPts), 32, 0.011, 6, false);
    t.mesh.geometry.dispose();
    t.mesh.geometry = g;
  }

  /* interaction */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let hover: Frame | null = null, open: Frame | null = null;
  const tilt = new THREE.Vector2(), tiltS = new THREE.Vector2();
  const pick = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const h = ray.intersectObjects(pickables, true)[0];
    return h ? { f: bySlug(h.object.userData.slug), p: h.point } : null;
  };
  function push(f: Frame, strength: number, depth = 0, from?: Frame) {
    f.vel += strength;
    if (depth > 2) return;
    for (const t of threads) {
      const other = t.a === f ? t.b : t.b === f ? t.a : null;
      if (!other || other === from) continue;
      t.wob = Math.min(1, t.wob + Math.abs(strength) * 0.5);
      setTimeout(() => alive && push(other, strength * 0.45 * (other.pin.x > f.pin.x ? 1 : -1) * Math.sign(strength || 1), depth + 1, f), 110);
    }
  }
  let lastX = 0;
  const onMove = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    tilt.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    if (e.pointerType !== "mouse" || open) return;
    const h = pick(e);
    const f = h?.f ?? null;
    if (f && f !== hover) { const dx = e.clientX - lastX; push(f, THREE.MathUtils.clamp(dx * 0.02, -0.6, 0.6) || 0.25); }
    hover = f;
    cv.style.cursor = f ? "pointer" : "default";
    lastX = e.clientX;
  };
  let down = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY }; lastX = e.clientX; };
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return;
    if (open) { close(); return; }
    const h = pick(e);
    if (!h) return;
    // swing it from where it was touched, then bring it close
    push(h.f, (h.p.x - h.f.pin.x) > 0 ? 0.9 : -0.9);
    setTimeout(() => { if (!alive) return; open = h.f; opts.onOpen(h.f.slug); }, 260);
  };
  const onLeave = () => { hover = null; tilt.set(0, 0); };
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointerleave", onLeave);
  function close() { open = null; opts.onOpen(null); }

  let portrait = false;
  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    portrait = w / h < 1;
    camera.fov = 30;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  function setMode(dark: boolean) {
    mWall.color.set(dark ? 0x5a524a : 0xf3ece2);
    hemi.intensity = dark ? 0.25 : 0.7;
    key.intensity = dark ? 0.7 : 1.6;
    spots.forEach((s) => (s.intensity = dark ? 26 : 14));
    renderer.toneMappingExposure = dark ? 0.9 : 1.0;
  }
  setMode(opts.dark);

  let raf = 0, last = performance.now(), started = false, intro = 0;
  const camPos = new THREE.Vector3(0, 0, 26), camLook = new THREE.Vector3();
  function start() {
    if (started) return;
    started = true;
    opts.onReady();
    // a draught moves through the room as you arrive
    frames.forEach((f, i) => setTimeout(() => alive && (f.vel += (i % 2 ? -1 : 1) * 0.35), 500 + i * 90));
  }
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!started) return;
    intro = Math.min(1, intro + dt * 0.6);
    const t = now / 1000;
    tiltS.lerp(tilt, 1 - Math.exp(-dt * 3));

    // camera: fit the whole wall, or come close to the opened certificate
    const fitW = tall ? 7.2 : 13, fitH = tall ? 11.2 : 7.4;
    const vf = THREE.MathUtils.degToRad(camera.fov);
    const distW = fitW / 2 / Math.tan(vf / 2) / camera.aspect, distH = fitH / 2 / Math.tan(vf / 2);
    let target = new THREE.Vector3(tiltS.x * 0.5, (tall ? 0.6 : 0.15) - tiltS.y * 0.25, Math.max(distW, distH) + (1 - intro) * 4);
    let look = new THREE.Vector3(tiltS.x * 0.15, tall ? 0.6 : 0.15, 0);
    if (open) {
      const c = open.pivot.position.clone().add(new THREE.Vector3(0, -(open.h / 2 + 0.53), 0));
      const d = Math.max((open.w * 1.25) / 2 / Math.tan(vf / 2) / camera.aspect, (open.h * 1.35) / 2 / Math.tan(vf / 2));
      target = c.clone().add(new THREE.Vector3(0, 0, d));
      look = c;
    }
    camPos.lerp(target, 1 - Math.exp(-dt * (open ? 4 : 3)));
    camLook.lerp(look, 1 - Math.exp(-dt * 4));
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    // frames swing on their pins like pendulums, and lean out a little from the wall when hovered
    for (const f of frames) {
      const acc = -18 * (f.ang - f.rest) - 1.6 * f.vel;
      f.vel += acc * dt;
      f.ang += f.vel * dt;
      f.ang = THREE.MathUtils.clamp(f.ang, -0.5, 0.5);
      f.pivot.rotation.z = f.ang + Math.sin(t * 0.7 + f.pin.x) * 0.002;
      f.liftT = f === hover || f === open ? 1 : 0;
      f.lift += (f.liftT - f.lift) * (1 - Math.exp(-dt * 8));
      f.group.rotation.x = -0.03 - f.lift * 0.05;
      f.group.position.z = f.lift * 0.08;
    }
    for (const th of threads) { th.wob = Math.max(0, th.wob - dt * 1.2); if (th.wob > 0.001 || !th.mesh.geometry.attributes.position) shapeThread(th, t); }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    close,
    setMode,
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); const mm = m.material as THREE.Material; if (mm && !Array.isArray(mm)) mm.dispose(); } });
      textures.forEach((x) => x.dispose());
      pmrem.dispose();
      renderer.dispose();
      cv.remove();
    },
  };
}
