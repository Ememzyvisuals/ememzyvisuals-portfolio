/* The hero scene: Emmanuel's developer at his desk, typing, built in Blender and loaded as two GLBs.
   Plain three.js so it stays light. Scroll moves the camera through four stops, the pointer makes it drift,
   and the camera is always kept outside the body, like walking round a statue. */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type Mode = "light" | "dark";

const STOPS: [number[], number[]][] = [
  [[-1.95, 1.45, 2.25], [0, 0.95, 0.28]],
  [[-1.15, 1.12, 1.25], [0, 0.88, 0.42]],
  [[1.05, 1.95, -1.55], [0, 0.8, 0.55]],
  [[2.05, 1.3, 1.65], [0, 0.95, 0.22]],
];
const GUARD = [
  { c: new THREE.Vector3(0, 1.15, 0.05), r: 0.42 },
  { c: new THREE.Vector3(0, 0.82, 0.45), r: 0.55 },
];
const PALETTE = {
  light: { top: "#e7e3f7", mid: "#f6f4fb", bot: "#fbfaf8", key: 0xfff1e2, keyI: 2.6, rim: 0xdcd6ff, rimI: 1.1, hemi: 0.55, env: 0.55, shadow: 0.22, exp: 1.05 },
  dark: { top: "#0b0a1d", mid: "#141033", bot: "#07060f", key: 0xffe7cf, keyI: 2.1, rim: 0x8b6cff, rimI: 3.2, hemi: 0.22, env: 0.32, shadow: 0.5, exp: 1.0 },
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function mountDesk(canvas: HTMLCanvasElement, opts: { mobile: boolean; mode: Mode; onReady: () => void; onFail: () => void }) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.mobile, alpha: false, powerPreference: "high-performance" });
  } catch {
    opts.onFail();
    return { setMode() {}, setProgress() {}, dispose() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd9cfc2, 0.55);
  const key = new THREE.DirectionalLight(0xfff1e2, 2.6);
  key.position.set(-1.6, 3.2, 1.8);
  key.castShadow = true;
  key.shadow.mapSize.set(opts.mobile ? 1024 : 2048, opts.mobile ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: 0.5, far: 8 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight(0xdcd6ff, 1.1);
  rim.position.set(1.4, 1.8, -2.2);
  const fill = new THREE.DirectionalLight(0xfff6ee, 0.9);
  fill.position.set(-0.6, 1.0, 2.4);
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.22 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(hemi, key, rim, fill, floor);

  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = 2;
  bgCanvas.height = 256;
  const bgTex = new THREE.CanvasTexture(bgCanvas);
  bgTex.colorSpace = THREE.SRGBColorSpace;
  scene.background = bgTex;

  function setMode(mode: Mode) {
    const p = PALETTE[mode];
    const g = bgCanvas.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, p.top);
    gr.addColorStop(0.6, p.mid);
    gr.addColorStop(1, p.bot);
    g.fillStyle = gr;
    g.fillRect(0, 0, 2, 256);
    bgTex.needsUpdate = true;
    key.color.setHex(p.key);
    key.intensity = p.keyI;
    rim.color.setHex(p.rim);
    rim.intensity = p.rimI;
    hemi.intensity = p.hemi;
    scene.environmentIntensity = p.env;
    floorMat.opacity = p.shadow;
    renderer.toneMappingExposure = p.exp;
    dirty = true;
  }

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
  let mixer: THREE.AnimationMixer | null = null;
  let progress = 0, mx = 0, my = 0, tmx = 0, tmy = 0, dirty = true, visible = true, raf = 0, disposed = false;

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  Promise.all([loader.loadAsync("/models/hero/set.glb"), loader.loadAsync("/models/hero/dev.glb")])
    .then(([set, dev]) => {
      if (disposed) return;
      for (const g of [set, dev]) {
        g.scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          m.castShadow = true;
          m.receiveShadow = true;
          const mat = m.material as THREE.MeshStandardMaterial;
          if (mat && /hair|brows|lashes/i.test(mat.name)) {
            mat.alphaTest = 0.45;
            mat.transparent = false;
            mat.depthWrite = true;
            mat.side = THREE.DoubleSide;
          }
          if (mat && /^screen/.test(mat.name)) {
            mat.emissiveIntensity = 1.4;
            m.castShadow = false;
          }
        });
        scene.add(g.scene);
      }
      mixer = new THREE.AnimationMixer(dev.scene);
      dev.animations.forEach((a) => mixer!.clipAction(a).play());
      resize();
      renderer.compile(scene, camera);
      opts.onReady();
    })
    .catch(() => opts.onFail());

  const V = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
  function camAt(p: number) {
    const n = STOPS.length - 1;
    const f = Math.min(n - 1e-6, Math.max(0, p * n));
    const i = Math.floor(f), t = ease(f - i);
    const pos = V(STOPS[i][0]).lerp(V(STOPS[i + 1][0]), t), tgt = V(STOPS[i][1]).lerp(V(STOPS[i + 1][1]), t);
    // portrait screens see less of the sides, so the camera steps back to keep him and the desk in frame
    const k = camera.aspect < 0.8 ? 1.55 : camera.aspect < 1.2 ? 1.3 : 1.45;
    pos.sub(tgt).multiplyScalar(k).add(tgt);
    return [pos, tgt];
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 42 : 32;
    // wide screens: he sits in the right third, the text column takes the left
    if (w / h > 1.2) camera.setViewOffset(w, h, -w * 0.2, 0, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    dirty = true;
  }
  const onMove = (e: PointerEvent) => {
    tmx = (e.clientX / window.innerWidth) * 2 - 1;
    tmy = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("resize", resize);
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(canvas);

  const up = new THREE.Vector3(0, 1, 0);
  const timer = new THREE.Timer();
  function frame(ts: number) {
    raf = requestAnimationFrame(frame);
    timer.update(ts);
    if (!visible || document.hidden || !mixer) return;
    const dt = Math.min(timer.getDelta(), 0.05);
    mixer.update(dt);
    mx += (tmx - mx) * Math.min(1, dt * 3);
    my += (tmy - my) * Math.min(1, dt * 3);
    const [pos, tgt] = camAt(progress);
    const side = new THREE.Vector3().subVectors(pos, tgt).cross(up).normalize();
    pos.addScaledVector(side, mx * 0.12);
    pos.y -= my * 0.06;
    for (const s of GUARD) {
      const d = pos.clone().sub(s.c);
      if (d.length() < s.r) pos.copy(s.c).addScaledVector(d.normalize(), s.r);
    }
    camera.position.copy(pos);
    camera.lookAt(tgt);
    renderer.render(scene, camera);
  }
  setMode(opts.mode);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    setMode,
    setProgress(p: number) {
      progress = Math.min(1, Math.max(0, p));
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      io.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mt) => {
            Object.values(mt).forEach((v) => (v as THREE.Texture)?.isTexture && (v as THREE.Texture).dispose());
            mt.dispose();
          });
        }
      });
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
