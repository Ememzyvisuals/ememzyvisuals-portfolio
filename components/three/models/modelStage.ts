// components/three/models/modelStage.ts
// One small 3D piece per Axiveri model, drawn from what the model actually does, in Axiveri orange and white.
//   asr   NaijaVox:      a voice wave flows in from the left and breaks into floating text glyphs on the right
//   tts   WazobiaVoice:  text glyphs flow in and become a voice wave; move across it and the voice gets livelier
//   llm   Africlaude:    a web of word nodes; pulses run along the links and a tap lights a whole sentence path
//   image AfriVision:    a grid of noisy tiles that settles into a picture, and scatters again when touched
// On phones the scene draws one finished frame, keeps it as an image and frees the GPU straight away.
import * as THREE from "three";

export type ModelKind = "asr" | "tts" | "llm" | "image";
export type ModelApi = { dispose: () => void };

const ORANGE = new THREE.Color("#fc6401"), AMBER = new THREE.Color("#ffb347"), CREAM = new THREE.Color("#fff3e6"), INK = new THREE.Color("#2a160a");

export function mountModel(el: HTMLElement, kind: ModelKind, opts: { still: boolean; dark: boolean; onBrand?: boolean; onReady: () => void; onFail: () => void; onStill?: (url: string) => void }): ModelApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: opts.still });
  } catch { opts.onFail(); return { dispose() {} }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.still ? 2 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  const cv = renderer.domElement;
  cv.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 14);
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const glow = new THREE.PointLight(0xff7a1a, 30, 20, 1.6);
  glow.position.set(0, 0, 4);
  scene.add(glow);

  const dummy = new THREE.Object3D(), col = new THREE.Color();
  const pointer = new THREE.Vector2(0, 0), pointerS = new THREE.Vector2();
  let energy = 0; // taps add energy that decays
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  // a small atlas of glyphs from African language writing (Latin with tone marks, Ajami-style Hausa, Ge'ez, N'Ko)
  const glyphTex = (() => {
    const chars = ["ẹ", "ọ", "ṣ", "ń", "à", "ì", "ụ", "ị", "ɗ", "ƙ", "ɓ", "ŋ", "ε", "ɔ", "ሰ", "ላ", "ም", "ߒ", "ߞ", "و", "ب", "ẹ́", "ọ̀", "a"];
    const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = "600 92px 'Noto Sans', 'Segoe UI', Arial, sans-serif";
    chars.forEach((ch, i) => x.fillText(ch, (i % 8) * 128 + 64, Math.floor(i / 8) * 128 + 70));
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return track(t);
  })();
  const glyphGeo = (i: number) => {
    const g = new THREE.PlaneGeometry(0.62, 0.62);
    const u = (i % 8) / 8, v = 1 - (Math.floor(i / 8) + 1) / 4;
    const uv = g.attributes.uv;
    for (let k = 0; k < uv.count; k++) uv.setXY(k, u + uv.getX(k) / 8, v + uv.getY(k) / 4);
    return track(g);
  };

  let update: (t: number, dt: number) => void = () => {};

  if (kind === "asr" || kind === "tts") {
    // voice bars on one side, glyphs on the other; asr flows wave -> text, tts flows text -> wave
    const BARS = 64;
    const bar = track(new THREE.BoxGeometry(0.11, 1, 0.11));
    const bars = new THREE.InstancedMesh(bar, track(new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 })), BARS);
    scene.add(bars);
    const G = 22;
    const glyphMat = track(new THREE.MeshBasicMaterial({ map: glyphTex, transparent: true, color: opts.onBrand ? 0xffffff : opts.dark ? 0xffe2c8 : 0x3a1d0a, depthWrite: false }));
    const glyphs = Array.from({ length: G }, (_, i) => {
      const m = new THREE.Mesh(glyphGeo(i % 24), glyphMat);
      scene.add(m);
      return { m, seed: Math.random() * 100, y: (Math.random() - 0.5) * 3.2, z: (Math.random() - 0.5) * 1.5, sp: 0.5 + Math.random() * 0.6 };
    });
    const asr = kind === "asr";
    scene.scale.setScalar(1.3);
    update = (t) => {
      const lively = 0.6 + pointerS.x * 0.5 + energy * 1.4; // tts: move across it and the voice gets livelier
      for (let i = 0; i < BARS; i++) {
        const u = i / (BARS - 1);
        const x = asr ? -6.2 + u * 6.6 : -0.2 + u * 6.4;
        // a speech-like envelope: syllable bumps riding a phrase curve
        const phrase = Math.sin(u * Math.PI) ** 0.6;
        const syll = Math.abs(Math.sin(u * 22 - t * (asr ? 6 : 7) * (kind === "tts" ? lively : 1)));
        const amp = (0.25 + 2.6 * phrase * syll * (asr ? 1 : lively)) * (asr ? 1 - u * 0.55 : 0.45 + u * 0.55);
        dummy.position.set(x, 0, 0);
        dummy.scale.set(1, Math.max(0.12, amp), 1);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        bars.setMatrixAt(i, dummy.matrix);
        if (opts.onBrand) col.set(0xffffff).lerp(CREAM, syll * 0.5);
        else col.copy(ORANGE).lerp(AMBER, syll * 0.6);
        bars.setColorAt(i, col);
      }
      bars.instanceMatrix.needsUpdate = true;
      if (bars.instanceColor) bars.instanceColor.needsUpdate = true;
      for (const g of glyphs) {
        // drift outwards from the middle (asr) or inwards to it (tts)
        const p = ((t * g.sp * 0.35 + g.seed) % 1);
        const x = asr ? 0.6 + p * 5.6 : -6.2 + p * 6.0;
        const fade = asr ? Math.min(1, p * 4) * (1 - Math.max(0, p - 0.8) * 5) : (1 - Math.max(0, p - 0.75) * 4) * Math.min(1, p * 5);
        g.m.position.set(x, g.y + Math.sin(t + g.seed) * 0.15, g.z);
        g.m.scale.setScalar(0.65 + fade * 0.55 + energy * 0.2);
        g.m.rotation.z = Math.sin(t * 0.8 + g.seed) * 0.15;
        (g.m.material as THREE.MeshBasicMaterial).opacity = 1;
        g.m.visible = fade > 0.02;
        g.m.scale.multiplyScalar(Math.max(0.02, fade));
      }
      scene.rotation.y = pointerS.x * 0.18;
      scene.rotation.x = -pointerS.y * 0.1;
    };
  }

  if (kind === "llm") {
    // nodes on a loose sphere, links between near neighbours, pulses travelling along links
    const NODES = 46;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODES; i++) {
      const y = 1 - (i / (NODES - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      pts.push(new THREE.Vector3(Math.cos(th) * r * 4.3, y * 3.1, Math.sin(th) * r * 2.2));
    }
    const nodes = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.13, 16, 12)), track(new THREE.MeshStandardMaterial({ roughness: 0.3 })), NODES);
    scene.add(nodes);
    const links: [number, number][] = [];
    for (let i = 0; i < NODES; i++) {
      const near = pts.map((p, j) => [p.distanceTo(pts[i]), j] as [number, number]).filter(([, j]) => j > i).sort((a, b) => a[0] - b[0]).slice(0, 3);
      for (const [, j] of near) links.push([i, j]);
    }
    const lg = track(new THREE.BufferGeometry().setFromPoints(links.flatMap(([a, b]) => [pts[a], pts[b]])));
    const lineMat = track(new THREE.LineBasicMaterial({ color: opts.dark ? 0x8a5a3a : 0xf2c9a8, transparent: true, opacity: 0.85 }));
    const lines = new THREE.LineSegments(lg, lineMat);
    scene.add(lines);
    const P = 26;
    const pulses = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.07, 10, 8)), track(new THREE.MeshBasicMaterial({ color: ORANGE })), P);
    scene.add(pulses);
    const pulse = Array.from({ length: P }, () => ({ l: Math.floor(Math.random() * links.length), p: Math.random(), sp: 0.4 + Math.random() * 0.8 }));
    const glyphMat = track(new THREE.MeshBasicMaterial({ map: glyphTex, transparent: true, color: opts.dark ? 0xffe2c8 : 0x3a1d0a, depthWrite: false }));
    const labels = [3, 9, 15, 22, 30, 38, 43].map((n, i) => { const m = new THREE.Mesh(glyphGeo(i * 3 + 1), glyphMat); scene.add(m); return { m, n }; });
    const lit = new Float32Array(NODES);
    update = (t, dt) => {
      const group = [nodes, lines, pulses, ...labels.map((l) => l.m)];
      for (const o of group) o.rotation.y = t * 0.12 + pointerS.x * 0.5;
      for (const o of group) o.rotation.x = pointerS.y * 0.25;
      for (const pl of pulse) {
        pl.p += dt * pl.sp * (1 + energy * 2);
        if (pl.p >= 1) { lit[links[pl.l][1]] = 1; pl.p = 0; const from = links[pl.l][1]; const next = links.filter(([a]) => a === from); pl.l = next.length ? links.indexOf(next[Math.floor(Math.random() * next.length)]) : Math.floor(Math.random() * links.length); }
        const [a, b] = links[pl.l];
        dummy.position.lerpVectors(pts[a], pts[b], pl.p);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        pulses.setMatrixAt(pulse.indexOf(pl), dummy.matrix);
      }
      pulses.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < NODES; i++) {
        lit[i] = Math.max(0, lit[i] - dt * 1.2);
        dummy.position.copy(pts[i]);
        dummy.scale.setScalar(1 + lit[i] * 1.2);
        dummy.updateMatrix();
        nodes.setMatrixAt(i, dummy.matrix);
        col.copy(opts.dark ? INK : CREAM).lerp(ORANGE, 0.35 + lit[i] * 0.65);
        nodes.setColorAt(i, col);
      }
      nodes.instanceMatrix.needsUpdate = true;
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
      for (const l of labels) {
        const p = pts[l.n].clone().applyEuler(nodes.rotation);
        l.m.position.copy(p).add(new THREE.Vector3(0.35, 0.3, 0.2));
        l.m.quaternion.copy(camera.quaternion);
        l.m.scale.setScalar(0.75 + lit[l.n] * 0.6);
      }
    };
  }

  if (kind === "image") {
    // a 20 x 14 grid of tiles: random orange noise that settles into a warm picture, scattering when touched
    const W = 22, H = 14, N = W * H;
    const tiles = new THREE.InstancedMesh(track(new THREE.BoxGeometry(0.42, 0.42, 0.14)), track(new THREE.MeshStandardMaterial({ roughness: 0.55 })), N);
    scene.add(tiles);
    // the "picture": a sun setting over hills and a lone baobab, drawn in a tiny canvas and sampled per tile
    const pic = (() => {
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#ffcf8a"); g.addColorStop(0.55, "#fc6401"); g.addColorStop(1, "#7a2a05");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = "#fff1d6"; x.beginPath(); x.arc(W * 0.66, H * 0.52, 2.6, 0, 7); x.fill();
      x.fillStyle = "#3b1404"; x.beginPath(); x.moveTo(0, H); x.quadraticCurveTo(W * 0.3, H * 0.55, W * 0.6, H * 0.82); x.quadraticCurveTo(W * 0.85, H * 0.95, W, H * 0.72); x.lineTo(W, H); x.fill();
      x.fillRect(W * 0.24, H * 0.42, 1, 3.5); x.beginPath(); x.ellipse(W * 0.245, H * 0.38, 2.6, 1.3, 0, 0, 7); x.fill();
      return x.getImageData(0, 0, W, H).data;
    })();
    const target = Array.from({ length: N }, (_, i) => new THREE.Color(pic[i * 4] / 255, pic[i * 4 + 1] / 255, pic[i * 4 + 2] / 255).convertSRGBToLinear());
    const noise = Array.from({ length: N }, () => new THREE.Color().copy(ORANGE).lerp(Math.random() > 0.5 ? CREAM : INK, Math.random()));
    const off = Array.from({ length: N }, () => new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, Math.random() * 3));
    let settle = 0;
    update = (t, dt) => {
      settle = Math.min(1, Math.max(0, settle + dt * 0.35 - energy * dt * 3));
      for (let i = 0; i < N; i++) {
        const gx = i % W, gy = Math.floor(i / W);
        const order = Math.min(1, Math.max(0, settle * 1.6 - ((gx * 7 + gy * 13) % 17) / 17 * 0.6));
        const e = order * order * (3 - 2 * order);
        dummy.position.set((gx - (W - 1) / 2) * 0.45 + off[i].x * (1 - e), ((H - 1) / 2 - gy) * 0.45 + off[i].y * (1 - e), off[i].z * (1 - e) + Math.sin(t * 2 + i) * 0.03 * (1 - e));
        dummy.rotation.set((1 - e) * off[i].x, (1 - e) * off[i].y, 0);
        dummy.scale.setScalar(0.6 + e * 0.4);
        dummy.updateMatrix();
        tiles.setMatrixAt(i, dummy.matrix);
        col.copy(noise[i]).lerp(target[i], e);
        tiles.setColorAt(i, col);
      }
      tiles.instanceMatrix.needsUpdate = true;
      if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true;
      tiles.rotation.y = pointerS.x * 0.3;
      tiles.rotation.x = -pointerS.y * 0.2;
    };
    if (opts.still) settle = 1;
  }

  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    // fit about 14 units of width on any shape
    camera.position.z = Math.max(12, 7.4 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.aspect);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1); };
  const onLeave = () => pointer.set(0, 0);
  const onDown = () => (energy = 1);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerleave", onLeave);
  cv.addEventListener("pointerdown", onDown);

  let raf = 0, last = performance.now(), t = 0, alive = true;
  const frame = (now: number) => {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    t += dt;
    pointerS.lerp(pointer, 1 - Math.exp(-dt * 4));
    energy = Math.max(0, energy - dt * 0.8);
    update(t, dt);
    renderer.render(scene, camera);
  };
  if (opts.still) {
    // phones: run a short warm-up, keep the finished frame as an image, free the GPU
    for (let i = 0; i < 90; i++) { t += 1 / 30; update(t, 1 / 30); }
    renderer.render(scene, camera);
    const url = cv.toDataURL("image/webp", 0.85);
    opts.onStill?.(url);
    opts.onReady();
  } else {
    const loop = (now: number) => { raf = requestAnimationFrame(loop); if (alive) frame(now); };
    raf = requestAnimationFrame(loop);
    opts.onReady();
  }

  return {
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh || (o as THREE.LineSegments).isLineSegments) { m.geometry?.dispose(); const mm = m.material as THREE.Material; mm?.dispose?.(); } });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      cv.remove();
    },
  };
}
