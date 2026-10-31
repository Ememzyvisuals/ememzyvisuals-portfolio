// components/three/idcard/idStage.ts
// My ID card on a lanyard. It drops in when the page opens and hangs from a strap simulated as a rope.
// Grab and drag it, let go and it swings; flick it sideways and it spins; tap it to flip it over.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type IdApi = { dispose: () => void };

const N = 16; // rope points
const CW = 2.16, CH = 3.44; // card size (54 x 86 mm)

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
  scene.environmentIntensity = 0.55;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-3, 6, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 8, bottom: -8, near: 1, far: 30 });
  key.shadow.radius = 6;
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0x777777, 0.55));
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.1 }));
  catcher.position.z = -1.4;
  catcher.receiveShadow = true;
  scene.add(catcher);

  /* textures */
  const loader = new THREE.TextureLoader();
  let pending = 3, alive = true, started = false;
  const done = () => { if (--pending === 0 && alive) { started = true; opts.onReady(); } };
  const tex = (n: string) => {
    const t = loader.load(`/models/idcard/${n}.webp`, done, undefined, () => opts.onFail());
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const front = tex("front"), back = tex("back"), strapT = tex("strap");
  strapT.wrapS = THREE.RepeatWrapping;

  /* card: white PVC with printed faces under a glossy laminate */
  const card = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(CW, CH, 0.035, 4, 0.12), new THREE.MeshPhysicalMaterial({ color: 0xf6f4ef, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 }));
  body.castShadow = true;
  card.add(body);
  const faceGeo = new THREE.PlaneGeometry(CW - 0.02, CH - 0.02);
  // round the printed corners to match the card by trimming with a rounded alpha
  const alpha = (() => {
    const c = document.createElement("canvas"); c.width = 216; c.height = 344;
    const x = c.getContext("2d")!; x.fillStyle = "#000"; x.fillRect(0, 0, 216, 344); x.fillStyle = "#fff";
    x.beginPath(); x.roundRect(0, 0, 216, 344, 12); x.fill();
    return new THREE.CanvasTexture(c);
  })();
  const faceMat = (map: THREE.Texture) => new THREE.MeshPhysicalMaterial({ map, alphaMap: alpha, transparent: true, roughness: 0.4, clearcoat: 1, clearcoatRoughness: 0.08 });
  const f = new THREE.Mesh(faceGeo, faceMat(front));
  f.position.z = 0.0185;
  const bk = new THREE.Mesh(faceGeo, faceMat(back));
  bk.position.z = -0.0185;
  bk.rotation.y = Math.PI;
  card.add(f, bk);
  // metal clip: a ring through the card's slot and a little hook
  const metal = new THREE.MeshPhysicalMaterial({ color: 0xd9dbe0, metalness: 1, roughness: 0.22 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 12, 32), metal);
  ring.position.y = CH / 2 - 0.12;
  ring.rotation.y = Math.PI / 2;
  ring.castShadow = true;
  const hook = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.42, 0.1, 3, 0.04), metal);
  hook.position.y = CH / 2 + 0.22;
  hook.castShadow = true;
  card.add(ring, hook);
  scene.add(card);

  /* rope (verlet) for the strap */
  const pts = Array.from({ length: N }, () => new THREE.Vector3());
  const prev = Array.from({ length: N }, () => new THREE.Vector3());
  let seg = 0.4;
  const anchor = new THREE.Vector3();

  // the strap: two strands of printed ribbon, apart at the top (round the neck) and meeting at the clip
  const strapMat = new THREE.MeshStandardMaterial({ map: strapT, roughness: 0.75, side: THREE.DoubleSide });
  const strapGeo = new THREE.BufferGeometry();
  const SW = 0.34;
  const posArr = new Float32Array(2 * N * 2 * 3), uvArr = new Float32Array(2 * N * 2 * 2);
  const idx: number[] = [];
  for (let s = 0; s < 2; s++) for (let i = 0; i < N - 1; i++) {
    const a = (s * N + i) * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  strapGeo.setIndex(idx);
  strapGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
  strapGeo.setAttribute("uv", new THREE.BufferAttribute(uvArr, 2));
  const strap = new THREE.Mesh(strapGeo, strapMat);
  strap.castShadow = true;
  strap.frustumCulled = false;
  scene.add(strap);

  let viewH = 10;
  const layout = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    viewH = 10;
    camera.position.set(0, 0, viewH / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    anchor.set(0, viewH / 2 + 0.6, 0);
    seg = (viewH * 0.5) / (N - 1);
  };
  const ro = new ResizeObserver(layout);
  ro.observe(el);
  layout();
  // drop in: start the whole strap bunched high above the view so it falls into place
  pts.forEach((p, i) => { p.set((i / N) * 0.6, anchor.y + 3 + i * 0.05, 0); prev[i].copy(p); });

  /* card spin and flip */
  let spin = 0, spinV = 0, flip = 0;

  /* pointer */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let grab = false, grabOff = new THREE.Vector3(), target = new THREE.Vector3(), downAt = { x: 0, y: 0, t: 0 }, lastX = 0, lastT = 0, vx = 0;
  const toWorld = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    return ray;
  };
  const onDown = (e: PointerEvent) => {
    const r = toWorld(e);
    if (!r.intersectObject(body, false).length && !r.intersectObject(f, false).length && !r.intersectObject(bk, false).length) return;
    const p = new THREE.Vector3();
    r.ray.intersectPlane(plane, p);
    grab = true;
    grabOff.copy(pts[N - 1]).sub(p);
    target.copy(pts[N - 1]);
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
    lastX = e.clientX; lastT = downAt.t;
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = "grabbing";
  };
  const onMove = (e: PointerEvent) => {
    const r = toWorld(e);
    if (grab) {
      const p = new THREE.Vector3();
      r.ray.intersectPlane(plane, p);
      target.copy(p).add(grabOff);
      const now = performance.now();
      vx = (e.clientX - lastX) / Math.max(8, now - lastT);
      lastX = e.clientX; lastT = now;
    } else if (e.pointerType === "mouse") {
      cv.style.cursor = r.intersectObject(body, false).length ? "grab" : "default";
    }
  };
  const onUp = (e: PointerEvent) => {
    if (!grab) return;
    grab = false;
    cv.style.cursor = "grab";
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    if (moved < 6 && performance.now() - downAt.t < 350) flip += Math.PI; // a tap flips it over
    else spinV += THREE.MathUtils.clamp(vx * 6, -14, 14); // a flick spins it
  };
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointercancel", onUp);

  const up = new THREE.Vector3(), tmp = new THREE.Vector3(), side = new THREE.Vector3(), q = new THREE.Quaternion(), m4 = new THREE.Matrix4();
  let raf = 0, last = performance.now();
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    if (!started) return;

    // verlet integration with gravity and damping; the end carries the card's weight
    const g = -26 * dt * dt;
    for (let i = 1; i < N; i++) {
      const p = pts[i], o = prev[i];
      tmp.copy(p).sub(o).multiplyScalar(0.985);
      o.copy(p);
      p.add(tmp);
      p.y += g * (i === N - 1 ? 2.2 : 1);
      p.z *= 0.9;
    }
    if (grab) pts[N - 1].lerp(target, 0.35);
    pts[0].copy(anchor);
    for (let k = 0; k < 24; k++) {
      for (let i = 0; i < N - 1; i++) {
        const a = pts[i], b = pts[i + 1];
        tmp.copy(b).sub(a);
        const d = tmp.length() || 1e-6, diff = (d - seg) / d;
        if (i === 0) b.addScaledVector(tmp, -diff);
        else { a.addScaledVector(tmp, diff * 0.5); b.addScaledVector(tmp, -diff * 0.5); }
      }
      pts[0].copy(anchor);
    }

    // card hangs from the end of the strap, leaning with the last piece of rope
    const C = pts[N - 1];
    up.copy(pts[N - 3]).sub(C).normalize();
    spinV += (-6 * Math.sin(spin - flip) - 1.4 * spinV) * dt; // settles to face front or back
    spin += spinV * dt;
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
    card.quaternion.copy(q).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spin));
    card.position.copy(C).addScaledVector(up, -(CH / 2 + 0.42));

    // strap ribbons
    let L = 0;
    for (let s = 0; s < 2; s++) {
      L = 0;
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const t = i / (N - 1);
        const spread = (1 - t) * 0.9 * (s ? 1 : -1);
        tmp.copy(i < N - 1 ? pts[i + 1] : p).sub(i < N - 1 ? p : pts[i - 1]).normalize();
        side.set(1, 0, 0).sub(tmp.clone().multiplyScalar(tmp.x)).normalize();
        const cx = p.x + spread, cz = p.z + (s ? -0.02 : 0.02);
        const o = (s * N + i) * 2;
        posArr.set([cx - side.x * SW / 2, p.y - side.y * SW / 2, cz], o * 3);
        posArr.set([cx + side.x * SW / 2, p.y + side.y * SW / 2, cz], (o + 1) * 3);
        if (i > 0) L += pts[i].distanceTo(pts[i - 1]);
        uvArr.set([L / 5.3, 0, L / 5.3, 1], o * 2);
      }
    }
    strapGeo.attributes.position.needsUpdate = true;
    strapGeo.attributes.uv.needsUpdate = true;
    strapGeo.computeVertexNormals();
    void m4;
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
      [front, back, strapT, alpha].forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      cv.remove();
    },
  };
}
