/* Live 3D previews for the Games section, built from the games' own models.
   buka: Mama Titi from Bùkà Hustle. She idles, nods and thinks; tap her and she greets you, then serves.
   bus:  the LAST BUS danfo at night with its passengers. It idles with the engine running; tap it and the
         inside bulb flickers, the bus jolts forward and every passenger slowly turns to look at you. */
import * as THREE from "three";
import { polishRenderer, polishLight, polishScene } from "@/components/three/polish";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type GameScene = "buka" | "bus";
// full = the /games page: drag to orbit, and actions you can trigger from buttons
export type GameApi = { act: (name: string) => void };
const PASSENGERS = ["tunde", "kunle", "chidi", "adaeze", "mama_sade"];

export function mountGame(el: HTMLElement, kind: GameScene, onReady: () => void, onFail: () => void, opts: { full?: boolean; onApi?: (a: GameApi) => void } = {}) {
  const full = !!opts.full;
  let action: (n: string) => void = () => {};
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    onFail();
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = kind === "buka" ? THREE.NeutralToneMapping : THREE.AgXToneMapping;
  renderer.shadowMap.enabled = true;
  polishRenderer(renderer);
  const cv = renderer.domElement;
  cv.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:${full ? "none" : "pan-y"};cursor:${full ? "grab" : "pointer"}`;
  el.appendChild(cv);

  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 80);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const clock = new THREE.Timer();
  let alive = true, raf = 0, visible = true;
  let mixer: THREE.AnimationMixer | null = null;
  const look = new THREE.Vector3();
  let tap: () => void = () => {};
  let tick: (dt: number, t: number) => void = () => {};
  let px = 0, tpx = 0;
  let inside = false; const insideCam = new THREE.Vector3(), insideLook = new THREE.Vector3();
  // orbit (full page): yaw/pitch around the look point
  let yaw = 0, pitch = 0, tyaw = 0, tpitch = 0, dragging = false, lx = 0, ly = 0, moved = 0;

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(kind === "bus" ? (full ? 14 : 4.5) : 1.1, 48), new THREE.ShadowMaterial({ opacity: kind === "bus" ? 0.5 : 0.22 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.receiveShadow = true;
  scene.add(shadow);

  if (kind === "buka") {
    scene.environmentIntensity = 0.5;
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb08a66, 0.9));
    const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
    sun.position.set(-1.5, 4, 3);
    sun.castShadow = true;
    polishLight(sun);
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    camera.position.set(0, 1.2, 3.0);
    look.set(0, 0.86, 0);
    loader.loadAsync("/models/games/mama_titi.glb").then((g) => {
      if (!alive) return;
      const o = g.scene;
      o.traverse((m) => { if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.frustumCulled = false; } });
      polishScene(o, renderer);
      scene.add(o);
      mixer = new THREE.AnimationMixer(o);
      const clip = (n: string) => g.animations.find((a) => a.name === n);
      const act = (n: string) => { const c = clip(n); return c ? mixer!.clipAction(c) : null; };
      const idle = act("Idle");
      idle?.play();
      let busy = false, next = 4;
      // play a one-off clip, then fade back to idle
      const once = (names: string[]) => {
        const a = act(names[0]);
        if (!a || !idle) return;
        busy = true;
        a.reset().setLoop(THREE.LoopOnce, 1);
        a.clampWhenFinished = true;
        a.crossFadeFrom(idle, 0.3, false).play();
        const done = () => {
          mixer!.removeEventListener("finished", done);
          if (names.length > 1) { idle.reset().play(); a.stop(); once(names.slice(1)); return; }
          idle.reset().play();
          idle.crossFadeFrom(a, 0.35, false);
          busy = false;
        };
        mixer!.addEventListener("finished", done);
      };
      tap = () => { if (!busy) once(["Greet", "Serve"]); };
      action = (n) => { if (busy) return; if (n === "Serve") once(["Greet", "Serve"]); else if (clip(n)) once([n]); };
      {
        // the real bùkà from the game (Kitchen-Hustle buka_set.glb, modelled in Blender), with Mama Titi at her stove
        shadow.visible = false;
        loader.loadAsync("/models/games/buka_set.glb").then((sg) => {
          if (!alive) return;
          const set = sg.scene.getObjectByName("set_static") || sg.scene;
          set.traverse((m) => { if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.receiveShadow = true; } });
          polishScene(set, renderer);
          scene.add(set);
          renderer.compile(scene, camera);
        }).catch(() => {});
        const S0 = new THREE.Vector3(1.6, 0, -3.8); // the stove in the game
        o.position.set(S0.x, 0, S0.z + 0.75);
        o.rotation.y = 0;
        sun.position.set(S0.x - 3, 8, S0.z + 6); sun.target.position.copy(S0); scene.add(sun.target);
        Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 30 }); sun.shadow.mapSize.set(2048, 2048);
        if (full) { camera.position.set(S0.x + 2.4, 2.4, S0.z + 6.2); look.set(S0.x, 1.0, S0.z + 0.4); }
        else { camera.position.set(S0.x + 1.25, 1.65, S0.z + 3.5); look.set(S0.x - 0.05, 1.05, S0.z + 0.55); }
      }
      tick = (dt) => {
        next -= dt;
        if (next < 0 && !busy) { next = 5 + Math.random() * 4; once([Math.random() < 0.5 ? "Nod" : "Think"]); }
        o.rotation.y += (px * 0.5 - o.rotation.y) * Math.min(1, dt * 3);
      };
      renderer.compile(scene, camera);
      rebase();
      opts.onApi?.({ act: (n) => action(n) });
      onReady();
    }).catch(onFail);
  } else {
    scene.background = null;
    scene.environmentIntensity = 0.15;
    scene.add(new THREE.HemisphereLight(0x6f86c9, 0x0a0a12, 0.5));
    const moon = new THREE.DirectionalLight(0x9fb4ff, 1.2);
    moon.position.set(4, 6, 3);
    moon.castShadow = true;
    polishLight(moon);
    moon.shadow.mapSize.set(1024, 1024);
    Object.assign(moon.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
    const bulb = new THREE.PointLight(0xffc27a, 6, 6, 1.5);
    bulb.position.set(0, 2.0, -0.2);
    const head = new THREE.SpotLight(0xfff2cc, 40, 14, 0.45, 0.5, 1.5);
    scene.add(moon, bulb, head, head.target);
    camera.position.set(5.8, 2.6, 4.6);
    look.set(0, 1.2, -0.2);
    Promise.all([loader.loadAsync("/models/games/bus.glb"), ...PASSENGERS.map((n) => loader.loadAsync(`/models/games/${n}.glb`).catch(() => null))])
      .then(([bus, ...people]) => {
        if (!alive || !bus) return;
        const rig = new THREE.Group();
        scene.add(rig);
        bus.scene.traverse((m) => { if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.receiveShadow = true; } });
        polishScene(bus.scene, renderer);
        rig.add(bus.scene);
        const box = new THREE.Box3().setFromObject(bus.scene), c = new THREE.Vector3(), sz = new THREE.Vector3();
        box.getCenter(c); box.getSize(sz);
        head.position.set(c.x, 1.0, box.max.z + 0.2);
        head.target.position.set(c.x, 0, box.max.z + 6);
        const heads: { bone: THREE.Object3D; rest: THREE.Quaternion }[] = [];
        const mixers: THREE.AnimationMixer[] = [];
        for (const g of people) {
          if (!g) continue;
          g.scene.traverse((m) => {
            if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.frustumCulled = false; }
            if ((m as THREE.Bone).isBone && /spine\.?006$/.test(m.name)) heads.push({ bone: m, rest: new THREE.Quaternion() });
          });
          polishScene(g.scene, renderer);
          rig.add(g.scene);
          const mx = new THREE.AnimationMixer(g.scene);
          g.animations.forEach((a) => mx.clipAction(a).play());
          mx.update(0);
          mixers.push(mx);
        }
        heads.forEach((h) => h.rest.copy(h.bone.quaternion));
        let stare = 0, stareT = 0, jolt = 0, flick = 0;
        inside = false;
        // stand by the driver and look back down the aisle at the passengers
        insideCam.set(c.x, box.min.y + sz.y * 0.72, box.max.z - sz.z * 0.12); insideLook.set(c.x, box.min.y + sz.y * 0.5, box.min.z);
        tap = () => { stareT = stareT > 0.5 ? 0 : 1; jolt = 1; flick = 1.2; };
        action = (n) => {
          if (n === "jolt") jolt = 1;
          if (n === "flicker") flick = 1.6;
          if (n === "stare") stareT = stareT > 0.5 ? 0 : 1;
          if (n === "inside") { inside = !inside; }
        };
        const q = new THREE.Quaternion(), wq = new THREE.Quaternion(), pq = new THREE.Quaternion(), hp = new THREE.Vector3(), dir = new THREE.Vector3(), fwd = new THREE.Vector3();
        tick = (dt, t) => {
          // engine idle: a small shake; a tap jolts it forward and back
          jolt = Math.max(0, jolt - dt * 0.9);
          rig.position.z = Math.sin((1 - jolt) * Math.PI) * jolt * 0.5;
          rig.position.y = Math.sin(t * 38) * 0.004 + Math.sin(t * 2.1) * 0.003;
          rig.rotation.z = Math.sin(t * 1.7) * 0.003;
          // the bulb flickers after a tap, and now and then on its own
          flick = Math.max(0, flick - dt);
          const f = flick > 0 ? (Math.sin(t * 60) > 0.2 ? 1 : 0.15) : Math.sin(t * 0.7) > 0.995 ? 0.3 : 1;
          bulb.intensity = 6 * f;
          // passengers turn to look at you
          stare += (stareT - stare) * Math.min(1, dt * 0.8);
          for (const m of mixers) m.update(dt);
          for (const h of heads) {
            h.bone.quaternion.copy(h.rest);
            if (stare < 0.01) continue;
            h.bone.getWorldPosition(hp);
            h.bone.getWorldQuaternion(wq);
            fwd.set(0, 0, 1).applyQuaternion(wq);
            dir.copy(camera.position).sub(hp).normalize();
            q.setFromUnitVectors(fwd, dir);
            q.slerp(new THREE.Quaternion(), 1 - stare * 0.85);
            wq.premultiply(q);
            h.bone.parent!.getWorldQuaternion(pq);
            h.bone.quaternion.copy(pq.invert().multiply(wq));
          }
        };
        renderer.compile(scene, camera);
        rebase();
        opts.onApi?.({ act: (n) => action(n) });
        onReady();
      })
      .catch(onFail);
  }

  function fit() {
    const w = el.clientWidth || 1, h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 40 : 30;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(fit);
  ro.observe(el);
  fit();
  const onTap = (e: PointerEvent) => { if (!full) { tap(); return; } dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); cv.style.cursor = "grabbing"; };
  const onUp = () => { if (!full || !dragging) return; dragging = false; cv.style.cursor = "grab"; if (moved < 6) tap(); };
  const onMove = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect(); tpx = ((e.clientX - r.left) / r.width) * 2 - 1;
    if (full && dragging) { const dx = e.clientX - lx, dy = e.clientY - ly; moved += Math.abs(dx) + Math.abs(dy); tyaw -= dx * 0.008; tpitch = THREE.MathUtils.clamp(tpitch + dy * 0.004, -0.35, 0.5); lx = e.clientX; ly = e.clientY; }
  };
  cv.addEventListener("pointerdown", onTap);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointercancel", onUp);
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(el);
  let base = camera.position.clone();
  const lookS = look.clone();
  const rebase = () => { base = camera.position.clone(); lookS.copy(look); };
  function frame(ts: number) {
    raf = requestAnimationFrame(frame);
    clock.update(ts);
    if (!visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.getElapsed();
    px += (tpx - px) * Math.min(1, dt * 2);
    mixer?.update(dt);
    tick(dt, t);
    // the camera leans a little with the pointer
    if (full) {
      yaw += (tyaw - yaw) * Math.min(1, dt * 6); pitch += (tpitch - pitch) * Math.min(1, dt * 6);
      if (!dragging) tyaw += dt * 0.05;
      const off = base.clone().sub(look);
      const r = off.length(), y0 = Math.atan2(off.x, off.z), p0 = Math.asin(off.y / r);
      const outside = new THREE.Vector3(Math.sin(y0 + yaw) * Math.cos(p0 + pitch), Math.sin(p0 + pitch), Math.cos(y0 + yaw) * Math.cos(p0 + pitch)).multiplyScalar(r).add(look);
      const target = inside ? insideCam.clone() : outside;
      camera.position.lerp(target, Math.min(1, dt * 3));
      lookS.lerp(inside ? insideLook.clone().add(new THREE.Vector3(Math.sin(yaw) * 2.5, -pitch * 2, 0)) : look, Math.min(1, dt * 3));
      camera.lookAt(lookS);
    } else {
      camera.position.copy(base).add(new THREE.Vector3(px * (kind === "bus" ? 0.8 : 0.3), 0, 0));
      camera.lookAt(look);
    }
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    cv.removeEventListener("pointerdown", onTap);
    cv.removeEventListener("pointermove", onMove);
    cv.removeEventListener("pointerup", onUp);
    cv.removeEventListener("pointercancel", onUp);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mt) => mt.dispose());
      }
    });
    pm.dispose();
    renderer.dispose();
    cv.remove();
  };
}
