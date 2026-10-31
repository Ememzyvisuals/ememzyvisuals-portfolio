// components/three/earth/globeStage.ts
// A realistic Earth for the Contact page: day map with relief, shiny oceans, city lights on the night side,
// drifting clouds and a soft atmosphere. Nigeria faces you with a pin; drag to spin it.
// When a message is sent, a paper plane lands on the pin ("globe:arrive") and the pin pulses.
// Textures: NASA Blue Marble based maps from the three.js examples (public domain / MIT).
import * as THREE from "three";

export type GlobeApi = { dispose: () => void; pulse: () => void };

const NIGERIA = { lat: 9.08, lon: 8.68 };
const R = 2;

function toVec(lat: number, lon: number, r: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat), th = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

export function mountGlobe(el: HTMLElement, opts: { still: boolean; dark: boolean; onReady: () => void; onFail: () => void; onStill?: (url: string) => void }): GlobeApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: opts.still });
  } catch { opts.onFail(); return { dispose() {}, pulse() {} }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.still ? 2 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  el.appendChild(renderer.domElement);
  const cv = renderer.domElement;
  cv.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 9.2);
  const sunDir = new THREE.Vector3(-1, 0.35, 0.9).normalize();
  const sun = new THREE.DirectionalLight(0xffffff, 3.2);
  sun.position.copy(sunDir).multiplyScalar(10);
  scene.add(sun, new THREE.AmbientLight(0x334466, opts.dark ? 0.15 : 0.35));

  const loader = new THREE.TextureLoader();
  let pending = 5, alive = true;
  const texs: THREE.Texture[] = [];
  const tex = (n: string, color = true) => {
    const t = loader.load(`/models/earth/${n}.webp`, () => { if (--pending === 0 && alive) start(); }, undefined, () => opts.onFail());
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texs.push(t);
    return t;
  };
  const day = tex("day"), normal = tex("normal", false), spec = tex("spec", false), lights = tex("lights"), clouds = tex("clouds", false);

  const earth = new THREE.Group();
  scene.add(earth);
  const geo = new THREE.SphereGeometry(R, 96, 64);
  // oceans shine, land does not: use the specular map inverted as roughness
  const mat = new THREE.MeshStandardMaterial({ map: day, normalMap: normal, normalScale: new THREE.Vector2(0.9, 0.9), roughnessMap: spec, roughness: 1, metalness: 0, emissiveMap: lights, emissive: new THREE.Color(0xffc27a), emissiveIntensity: 1.1 });
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.sunDir = { value: sunDir };
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 sunDir;")
      // invert the specular map so oceans are smooth and land is rough
      .replace("#include <roughnessmap_fragment>", "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\nvec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\nroughnessFactor = mix(0.95, 0.35, texelRoughness.g);\n#endif")
      // city lights only on the night side
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\nfloat nightSide = smoothstep(0.15, -0.25, dot(normalize(vNormal), normalize((viewMatrix * vec4(sunDir, 0.0)).xyz)));\ntotalEmissiveRadiance *= nightSide;");
  };
  const globe = new THREE.Mesh(geo, mat);
  earth.add(globe);
  const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(R * 1.012, 96, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, alphaMap: clouds, transparent: true, depthWrite: false, opacity: 0.85 }));
  earth.add(cloudMesh);

  // atmosphere: a back-faced shell that glows at the rim
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.06, 64, 48), new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { c: { value: new THREE.Color(0x5aa8ff) } },
    vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 c; varying vec3 vN; void main(){ float i = pow(max(0.0, 0.62 - dot(vN, vec3(0.0,0.0,1.0))), 3.0); gl_FragColor = vec4(c, 1.0) * i * 0.9; }",
  }));
  scene.add(atmo);

  // pin on Nigeria with a pulse ring
  const pinPos = toVec(NIGERIA.lat, NIGERIA.lon, R);
  const pin = new THREE.Group();
  pin.position.copy(pinPos);
  pin.lookAt(pinPos.clone().multiplyScalar(2));
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfc6401 }));
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xfc6401, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.085, 40), ringMat);
  pin.add(dot, ring);
  earth.add(pin);

  // face Nigeria towards the camera, tilted a little so it sits slightly above centre
  const baseY = -Math.atan2(pinPos.x, pinPos.z);
  const baseX = THREE.MathUtils.degToRad(NIGERIA.lat) * 0.8;
  earth.rotation.set(baseX, baseY - 0.35, 0);

  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    cv.style.width = "100%"; cv.style.height = "100%";
    camera.aspect = w / h;
    camera.position.z = Math.max(8.4, 8.4 / Math.min(1, camera.aspect));
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  /* drag to spin, settles back towards Nigeria */
  let drag = false, lastX = 0, lastY = 0, velY = 0, offY = 0, offX = 0, burst = 0;
  const onDown = (e: PointerEvent) => { drag = true; lastX = e.clientX; lastY = e.clientY; cv.setPointerCapture(e.pointerId); cv.style.cursor = "grabbing"; };
  const onMove = (e: PointerEvent) => {
    if (!drag) { if (e.pointerType === "mouse") cv.style.cursor = "grab"; return; }
    velY = (e.clientX - lastX) * 0.008; offY += velY; offX = THREE.MathUtils.clamp(offX + (e.clientY - lastY) * 0.004, -0.5, 0.5);
    lastX = e.clientX; lastY = e.clientY;
  };
  const onUp = () => { drag = false; cv.style.cursor = "grab"; };
  cv.addEventListener("pointerdown", onDown);
  cv.addEventListener("pointermove", onMove);
  cv.addEventListener("pointerup", onUp);
  cv.addEventListener("pointercancel", onUp);
  const pulse = () => { burst = 1; offY *= 0.3; };
  const onArrive = () => pulse();
  window.addEventListener("globe:arrive", onArrive);

  let raf = 0, last = performance.now(), t = 0;
  const update = (dt: number) => {
    t += dt;
    if (!drag) { offY += velY; velY *= 0.94; offY *= 0.985; offX *= 0.97; }
    earth.rotation.y = baseY - 0.35 + offY + Math.sin(t * 0.15) * 0.08;
    earth.rotation.x = baseX + offX;
    cloudMesh.rotation.y += dt * 0.012;
    burst = Math.max(0, burst - dt * 0.6);
    const p = (t * 0.6) % 1;
    const s = 1 + p * 3 + burst * 6;
    ring.scale.setScalar(s);
    ringMat.opacity = (1 - p) * 0.8 * (1 - burst) + burst * 0.9;
    dot.scale.setScalar(1 + burst * 1.5);
  };
  function start() {
    if (opts.still) {
      update(0.01);
      renderer.render(scene, camera);
      opts.onStill?.(cv.toDataURL("image/webp", 0.88));
      opts.onReady();
      return;
    }
    opts.onReady();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      update(dt);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
  }

  return {
    pulse,
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("globe:arrive", onArrive);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); } });
      texs.forEach((x) => x.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      cv.remove();
    },
  };
}
