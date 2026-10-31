// components/three/idcard/idStage.ts
// My two ID cards on their lanyards: PlotWeaver (Machine Learning Engineer) in front, Axiveri (Founder) just behind.
// They drop in when the page opens. Each strap is simulated as a rope. Grab and drag a card, let go and it swings;
// flick it sideways and it spins; tap it to flip it over.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type IdApi = { dispose: () => void };

const N = 16; // rope points per strap
const CW = 2.16, CH = 3.44; // card size (54 x 86 mm)
const CARDS = [
  { id: "ax", x: 0.95, z: -0.55, delay: 0.25, tilt: 0.12 }, // behind, to the right
  { id: "pw", x: -0.55, z: 0.35, delay: 0, tilt: -0.06 }, // in front
];

export function mountId(el: HTMLElement, opts: { onReady: () => void; onFail: () => void }): IdApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch { opts.onFail(); return { dispose() {} }; }
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
  scene.environmentIntensity = 0.5;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-3, 6, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 8, bottom: -8, near: 1, far: 30 });
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x777777, 0.6));
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.05 }));
  catcher.position.z = -2.4;
  catcher.receiveShadow = true;
  void catcher; // shadows on a wall behind looked like grey slabs on the page, so the cards cast none

  /* textures */
  const loader = new THREE.TextureLoader();
  const all: THREE.Texture[] = [];
  let pending = 0, alive = true, started = false, t0 = 0;
  const tex = (n: string) => {
    pending++;
    const t = loader.load(`/models/idcard/${n}.webp`, () => { if (--pending === 0 && alive) { started = true; t0 = performance.now(); opts.onReady(); } }, undefined, () => opts.onFail());
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    all.push(t);
    return t;
  };
  const alpha = (() => {
    const c = document.createElement("canvas"); c.width = 216; c.height = 344;
    const x = c.getContext("2d")!; x.fillStyle = "#000"; x.fillRect(0, 0, 216, 344); x.fillStyle = "#fff";
    x.beginPath(); x.roundRect(0, 0, 216, 344, 12); x.fill();
    return new THREE.CanvasTexture(c);
  })();
  const metal = new THREE.MeshPhysicalMaterial({ color: 0xd9dbe0, metalness: 1, roughness: 0.22 });
  const bodyGeo = new RoundedBoxGeometry(CW, CH, 0.035, 4, 0.12);
  const faceGeo = new THREE.PlaneGeometry(CW - 0.02, CH - 0.02);
  const ringGeo = new THREE.TorusGeometry(0.16, 0.03, 12, 32);
  const hookGeo = new RoundedBoxGeometry(0.24, 0.42, 0.1, 3, 0.04);
  const SW = 0.34;

  type Lanyard = {
    card: THREE.Group; hit: THREE.Object3D[]; pts: THREE.Vector3[]; prev: THREE.Vector3[]; anchor: THREE.Vector3;
    spin: number; spinV: number; flip: number; strapGeo: THREE.BufferGeometry; pos: Float32Array; uv: Float32Array; x: number; z: number; delay: number; tilt: number;
  };
  const lanyards: Lanyard[] = CARDS.map((c) => {
    const card = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshPhysicalMaterial({ color: 0xf6f4ef, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 }));
    body.castShadow = true;
    const faceMat = (n: string) => new THREE.MeshPhysicalMaterial({ map: tex(`${c.id}-${n}`), alphaMap: alpha, transparent: true, roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.08 });
    const f = new THREE.Mesh(faceGeo, faceMat("front"));
    f.position.z = 0.0185;
    const bk = new THREE.Mesh(faceGeo, faceMat("back"));
    bk.position.z = -0.0185;
    bk.rotation.y = Math.PI;
    const ring = new THREE.Mesh(ringGeo, metal);
    ring.position.y = CH / 2 - 0.12;
    ring.rotation.y = Math.PI / 2;
    const hook = new THREE.Mesh(hookGeo, metal);
    hook.position.y = CH / 2 + 0.22;
    hook.castShadow = true;
    card.add(body, f, bk, ring, hook);
    scene.add(card);

    const strapT = tex(`${c.id}-strap`);
    strapT.wrapS = THREE.RepeatWrapping;
    const strapGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(2 * N * 2 * 3), uv = new Float32Array(2 * N * 2 * 2), idx: number[] = [];
    for (let s = 0; s < 2; s++) for (let i = 0; i < N - 1; i++) { const a = (s * N + i) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    strapGeo.setIndex(idx);
    strapGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    strapGeo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const strap = new THREE.Mesh(strapGeo, new THREE.MeshStandardMaterial({ map: strapT, roughness: 0.75, side: THREE.DoubleSide }));
    strap.castShadow = true;
    strap.frustumCulled = false;
    scene.add(strap);

    const pts = Array.from({ length: N }, () => new THREE.Vector3());
    const prev = Array.from({ length: N }, () => new THREE.Vector3());
    return { card, hit: [body, f, bk], pts, prev, anchor: new THREE.Vector3(), spin: c.tilt, spinV: 0, flip: 0, strapGeo, pos, uv, x: c.x, z: c.z, delay: c.delay, tilt: c.tilt };
  });

  let seg = 0.4;
  const layout = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    const viewH = 8.6;
    camera.position.set(0, -0.3, viewH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.lookAt(0, -0.3, 0);
    camera.updateProjectionMatrix();
    seg = (viewH * 0.4) / (N - 1);
    // keep both cards inside narrow screens
    const halfW = (viewH * camera.aspect) / 2;
    const squeeze = Math.min(1, (halfW - CW / 2 - 0.15) / 1.0);
    for (const l of lanyards) l.anchor.set(l.x * squeeze, viewH / 2 + 0.6, l.z);
  };
  const ro = new ResizeObserver(layout);
  ro.observe(el);
  layout();
  // start bunched up above the view; each falls into place when its delay passes
  for (const l of lanyards) l.pts.forEach((p, i) => { p.set(l.anchor.x + (i / N) * 0.6, l.anchor.y + 3 + i * 0.05, l.z); l.prev[i].copy(p); });

  /* pointer */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let grabbed: Lanyard | null = null;
  const grabOff = new THREE.Vector3(), target = new THREE.Vector3();
  let downAt = { x: 0, y: 0, t: 0 }, lastX = 0, lastT = 0, vx = 0;
  const cast = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const h = ray.intersectObjects(lanyards.flatMap((l) => l.hit), false)[0];
    return h ? lanyards.find((l) => l.hit.includes(h.object))! : null;
  };
  const onDown = (e: PointerEvent) => {
    const l = cast(e);
    if (!l) return;
    plane.constant = -l.z;
    const p = new THREE.Vector3();
    ray.ray.intersectPlane(plane, p);
    grabbed = l;
    grabOff.copy(l.pts[N - 1]).sub(p);
    target.copy(l.pts[N - 1]);
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
    lastX = e.clientX; lastT = downAt.t; vx = 0;
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    if (grabbed) {
      cast(e);
      const p = new THREE.Vector3();
      ray.ray.intersectPlane(plane, p);
      target.copy(p).add(grabOff);
      const now = performance.now();
      vx = (e.clientX - lastX) / Math.max(8, now - lastT);
      lastX = e.clientX; lastT = now;
    } else if (e.pointerType === "mouse") cv.style.cursor = cast(e) ? "grab" : "default";
  };
  const onUp = (e: PointerEvent) => {
    if (!grabbed) return;
    const l = grabbed;
    grabbed = null;
    cv.style.cursor = "grab";
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    if (moved < 6 && performance.now() - downAt.t < 350) l.flip += Math.PI; // tap: flip it over
    else l.spinV += THREE.MathUtils.clamp(vx * 6, -14, 14); // flick: spin it
  };
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointercancel", onUp);

  const up = new THREE.Vector3(), d = new THREE.Vector3(), side = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion(), qs = new THREE.Quaternion();
  let raf = 0, last = performance.now();
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!started) return;
    const age = (now - t0) / 1000;
    const g = -26 * dt * dt;
    for (const l of lanyards) {
      const { pts, prev, anchor } = l;
      const live = age > l.delay;
      for (let i = 1; i < N; i++) {
        const p = pts[i], o = prev[i];
        d.copy(p).sub(o).multiplyScalar(0.985);
        o.copy(p);
        if (!live) continue;
        p.add(d);
        p.y += g * (i === N - 1 ? 2.2 : 1);
        p.z += (l.z - p.z) * 0.1;
      }
      if (grabbed === l) pts[N - 1].lerp(target, 0.35);
      if (live) {
        for (let k = 0; k < 24; k++) {
          pts[0].copy(anchor);
          for (let i = 0; i < N - 1; i++) {
            const a = pts[i], b = pts[i + 1];
            d.copy(b).sub(a);
            const len = d.length() || 1e-6, diff = (len - seg) / len;
            if (i === 0) b.addScaledVector(d, -diff);
            else { a.addScaledVector(d, diff * 0.5); b.addScaledVector(d, -diff * 0.5); }
          }
        }
      }

      // card hangs from the end of the strap and leans with it; spin settles to front or back
      const C = pts[N - 1];
      up.copy(pts[N - 3]).sub(C).normalize();
      l.spinV += (-6 * Math.sin(l.spin - l.flip - l.tilt) - 1.4 * l.spinV) * dt;
      l.spin += l.spinV * dt;
      q.setFromUnitVectors(Y, up);
      qs.setFromAxisAngle(Y, l.spin);
      l.card.quaternion.copy(q).multiply(qs);
      l.card.position.copy(C).addScaledVector(up, -(CH / 2 + 0.42));

      // two strands of printed strap, apart at the top (round the neck), meeting at the clip
      for (let s = 0; s < 2; s++) {
        let L = 0;
        for (let i = 0; i < N; i++) {
          const p = pts[i], t = i / (N - 1);
          const spread = (1 - t) * 0.8 * (s ? 1 : -1);
          d.copy(i < N - 1 ? pts[i + 1] : p).sub(i < N - 1 ? p : pts[i - 1]).normalize();
          side.set(1, 0, 0).addScaledVector(d, -d.x).normalize();
          const cx = p.x + spread, cz = p.z + (s ? -0.02 : 0.02);
          const o = (s * N + i) * 2;
          l.pos.set([cx - (side.x * SW) / 2, p.y - (side.y * SW) / 2, cz, cx + (side.x * SW) / 2, p.y + (side.y * SW) / 2, cz], o * 3);
          if (i > 0) L += pts[i].distanceTo(pts[i - 1]);
          l.uv.set([L / 5.3, 0, L / 5.3, 1], o * 2);
        }
      }
      l.strapGeo.attributes.position.needsUpdate = true;
      l.strapGeo.attributes.uv.needsUpdate = true;
      l.strapGeo.computeVertexNormals();
    }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); } });
      [...all, alpha].forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      cv.remove();
    },
  };
}
