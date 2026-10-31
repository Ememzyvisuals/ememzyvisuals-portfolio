// components/three/earth/foldFlight.ts
// The sent message folds into a paper dart in 3D and flies away.
// The filled-in form is captured as the paper's face. The sheet is a fine mesh; every frame each point is placed
// by replaying the real folds in order:
//   1. both top corners to the centre line      (flat folds, 180 degrees)
//   2. the new slanted edges to the centre again (flat folds, sharper nose)
//   3. fold in half down the centre              (the halves rise to make the keel)
//   4. wings fold down and out                   (the plane takes shape)
// then it lifts, turns its nose away and flies to the globe (or off the top of the screen).
import * as THREE from "three";

type V2 = { x: number; y: number };
const ease = (k: number) => (k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k));

// reflect point p across the line through a with direction d (all in the paper plane)
function reflect(p: V2, a: V2, d: V2): V2 {
  const l = Math.hypot(d.x, d.y), ux = d.x / l, uy = d.y / l;
  const vx = p.x - a.x, vy = p.y - a.y, t = vx * ux + vy * uy;
  return { x: a.x + 2 * t * ux - vx, y: a.y + 2 * t * uy - vy };
}
// signed side of p relative to the line a + s*d
const side = (p: V2, a: V2, d: V2) => d.x * (p.y - a.y) - d.y * (p.x - a.x);

export async function foldAndFly(rect: DOMRect, face: HTMLCanvasElement, target: { x: number; y: number } | null): Promise<void> {
  const W = window.innerWidth, H = window.innerHeight;
  const cv = document.createElement("canvas");
  Object.assign(cv.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "60" });
  document.body.appendChild(cv);
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const fov = 35;
  const camera = new THREE.PerspectiveCamera(fov, W / H, 1, 20000);
  camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2))); // 1 world unit = 1 pixel at z = 0
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa4b0, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(-300, 600, 900);
  scene.add(key);

  // paper in "paper units": width 2 (x from -1 to 1), height h, nose at the top
  const pw = rect.width, ph = rect.height;
  const h = (2 * ph) / pw;
  const SEG_X = 48, SEG_Y = Math.max(40, Math.round(48 * (h / 2)));
  const geo = new THREE.PlaneGeometry(2, h, SEG_X, SEG_Y);
  geo.translate(0, h / 2, 0); // y from 0 (bottom) to h (nose)
  const flat = (geo.attributes.position.array as Float32Array).slice();
  const tex = new THREE.CanvasTexture(face);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const front = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, side: THREE.FrontSide });
  const back = new THREE.MeshStandardMaterial({ color: 0xf7f6f2, roughness: 0.9, side: THREE.BackSide });
  const paper = new THREE.Group();
  paper.add(new THREE.Mesh(geo, front), new THREE.Mesh(geo, back));
  scene.add(paper);
  // place the sheet exactly over the form on screen
  const s0 = pw / 2; // pixels per paper unit, as the form sits on the page
  // first the sheet lifts and shrinks to fit comfortably on screen, so every fold is visible
  const s = Math.min(s0, (H * 0.62) / h, (W * 0.8) / 2);
  const home = new THREE.Vector3(rect.left + pw / 2 - W / 2, -(rect.top + ph) + H / 2, 0); // bottom-centre of the form
  paper.position.copy(home);
  paper.scale.setScalar(s0);
  const fitHome = new THREE.Vector3(home.x, -(h * s) / 2 - H * 0.02, 0); // centred on screen, same column

  // fold lines (paper units)
  const nose = { x: 0, y: h };
  const f1L = { a: nose, d: { x: -1, y: -1 } }, f1R = { a: nose, d: { x: 1, y: -1 } };
  const t22 = Math.tan(Math.PI / 8);
  const f2L = { a: nose, d: { x: -t22, y: -1 } }, f2R = { a: nose, d: { x: t22, y: -1 } };
  const wing = 0.36; // wing fold line, distance from the centre

  // stage timeline, seconds
  const T = { fit: [0, 0.5], f1: [0.55, 1.25], f2: [1.35, 2.05], half: [2.15, 2.8], wings: [2.75, 3.4], lift: [3.4, 3.85], fly: [3.85, 5.1] };
  const prog = (t: number, [a, b]: number[]) => ease((t - a) / (b - a));

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const p3 = new THREE.Vector3(), axis = new THREE.Vector3(), q = new THREE.Quaternion();
  const rotAbout = (v: THREE.Vector3, a: V2, d: V2, ang: number) => {
    axis.set(d.x, d.y, 0).normalize();
    q.setFromAxisAngle(axis, ang);
    v.sub(p3.set(a.x, a.y, 0)).applyQuaternion(q).add(p3);
  };

  const place = (t: number) => {
    const k1 = prog(t, T.f1), k2 = prog(t, T.f2), kh = prog(t, T.half), kw = prog(t, T.wings);
    for (let i = 0; i < pos.count; i++) {
      let p: V2 = { x: flat[i * 3], y: flat[i * 3 + 1] };
      const v = new THREE.Vector3(p.x, p.y, 0);
      let layer = 0;
      // 1. corners to the centre
      for (const f of [f1L, f1R]) {
        const inside = f === f1L ? side(p, f.a, f.d) < 0 && p.x < 0 : side(p, f.a, f.d) > 0 && p.x > 0;
        if (!inside) continue;
        if (k1 >= 1) { p = reflect(p, f.a, f.d); layer++; }
        else { v.set(p.x, p.y, 0); rotAbout(v, f.a, f.d, (f === f1L ? 1 : -1) * Math.PI * k1); }
      }
      // 2. edges to the centre again
      if (k1 >= 1) for (const f of [f2L, f2R]) {
        const inside = f === f2L ? side(p, f.a, f.d) < 0 && p.x < 0 : side(p, f.a, f.d) > 0 && p.x > 0;
        if (!inside) continue;
        if (k2 >= 1) { p = reflect(p, f.a, f.d); layer++; }
        else { v.set(p.x, p.y, 0.002 * layer); rotAbout(v, f.a, f.d, (f === f2L ? 1 : -1) * Math.PI * k2); }
      }
      if (k1 >= 1 && (k2 >= 1 || !(side(p, f2L.a, f2L.d) < 0 && p.x < 0) && !(side(p, f2R.a, f2R.d) > 0 && p.x > 0))) {
        // 3 and 4: halves rise into a keel, wings fold out
        const sgn = p.x < 0 ? -1 : 1, d = Math.abs(p.x);
        const c = 1.35 * kh, wgt = 1.5 * kw;
        let x: number, z: number;
        if (d <= wing || kw <= 0) { x = d * Math.cos(c); z = -d * Math.sin(c); }
        else {
          const bx = wing * Math.cos(c), bz = -wing * Math.sin(c), a = -c + wgt;
          x = bx + (d - wing) * Math.cos(a); z = bz + (d - wing) * Math.sin(a);
        }
        v.set(sgn * x, p.y, z + 0.003 * layer);
        // the halves fold upwards towards the viewer so we see the keel form
        v.z = -v.z;
      } else if (k1 >= 1 && k2 <= 0) v.z = 0.002 * layer;
      if (k1 <= 0) v.set(p.x, p.y, 0);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  };

  // the flight
  const end = target ? new THREE.Vector3(target.x - W / 2, -target.y + H / 2, -400) : new THREE.Vector3(W * 0.45, H * 0.9, -900);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = reduce ? 3 : 1;
  return new Promise((resolve) => {
    // a test hook lets a script step time by hand (window.__foldClock, in ms); normal visitors use the real clock
    const clock = () => ((window as unknown as { __foldClock?: number }).__foldClock ?? performance.now());
    const t0 = clock();
    const tick = () => {
      const t = ((clock() - t0) / 1000) * speed;
      place(t);
      // while folding the sheet tilts a little so the 3D reads; then it lifts, turns its nose to the target and flies
      const kl = prog(t, T.lift), kf = prog(t, T.fly);
      const kfit = prog(t, T.fit);
      const fold = Math.min(1, Math.max(0, (t - T.f1[0]) / (T.wings[1] - T.f1[0])));
      paper.rotation.set(-0.35 * fold - 0.5 * kl, 0.25 * Math.sin(fold * Math.PI), 0);
      const startScale = THREE.MathUtils.lerp(s0, s, kfit) * (1 - 0.3 * fold);
      const lift = new THREE.Vector3(0, h * s * 0.2 * kl, 120 * kl);
      const p = home.clone().lerp(fitHome, kfit).add(new THREE.Vector3(0, h * s * 0.15 * fold, 60 * kfit)).add(lift);
      if (kf > 0) {
        const dir = end.clone().sub(p);
        const yaw = Math.atan2(dir.x, dir.y);
        paper.rotation.set(-0.85 - 0.3 * kf, 0, -yaw * kf);
        p.lerp(end, kf * kf);
      }
      paper.position.copy(p);
      paper.scale.setScalar(startScale * (1 - 0.8 * kf));
      renderer.render(scene, camera);
      if (t < T.fly[1]) requestAnimationFrame(tick);
      else {
        renderer.dispose(); geo.dispose(); tex.dispose(); front.dispose(); back.dispose(); cv.remove();
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}
