// components/three/chess/chessStage.ts
// A real wooden chess set where every piece is a tool I use.
// Hover or tap a piece to see what it stands for. Tap one of your white pieces, then a glowing square, to play a move;
// black answers. Board and pieces use CC0 Poly Haven wood (ash, black walnut, flamed black veneer).
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BLACK, ORDER, WHITE, type Kind, type Tech } from "./pieces";

export type PieceInfo = { tech: Tech; kind: Kind; white: boolean } | null;
export type ChessApi = { reset: () => void; dispose: () => void };

type Piece = { kind: Kind; white: boolean; tech: Tech; f: number; r: number; obj: THREE.Group; lift: number; target: number; moved: boolean; alive: boolean };

const SQ = 1;
const sqPos = (f: number, r: number) => new THREE.Vector3((f - 3.5) * SQ, 0, (3.5 - r) * SQ);

/* ---------- piece shapes (Staunton style, made by turning a profile like a lathe) ---------- */
type P = [number, number];
const arc = (cx: number, cy: number, rad: number, a0: number, a1: number, n = 10): P[] =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [Math.max(0.0005, cx + Math.cos(a) * rad), cy + Math.sin(a) * rad]; });
const D = Math.PI / 180;

function base(r: number): P[] {
  return [[0.0005, 0], [r, 0], ...arc(r - 0.03, 0.05, 0.03, -90 * D, 90 * D, 6), [r - 0.04, 0.09], ...arc(r - 0.06, 0.12, 0.035, -90 * D, 90 * D, 6), [r - 0.1, 0.16]];
}
const PROFILES: Record<Exclude<Kind, "n">, P[]> = {
  p: [...base(0.33), [0.2, 0.2], [0.13, 0.42], [0.2, 0.46], [0.2, 0.49], [0.11, 0.52], ...arc(0, 0.66, 0.15, -70 * D, 90 * D, 14)],
  r: [...base(0.37), [0.24, 0.21], [0.19, 0.6], [0.25, 0.65], [0.25, 0.68], [0.22, 0.7], [0.23, 0.92], [0.27, 0.95], [0.27, 1.07], [0.2, 1.07], [0.2, 1.0], [0.0005, 1.0]],
  b: [...base(0.35), [0.2, 0.21], [0.12, 0.66], [0.21, 0.71], [0.21, 0.74], [0.12, 0.77], [0.15, 0.8], ...arc(0, 0.98, 0.17, -60 * D, 40 * D, 10), [0.07, 1.17], [0.04, 1.2], ...arc(0, 1.25, 0.05, -60 * D, 90 * D, 8)],
  q: [...base(0.39), [0.24, 0.22], [0.13, 0.86], [0.24, 0.92], [0.24, 0.96], [0.14, 0.99], [0.15, 1.04], [0.23, 1.32], [0.18, 1.36], [0.12, 1.37], ...arc(0, 1.43, 0.07, -60 * D, 90 * D, 8)],
  k: [...base(0.4), [0.25, 0.22], [0.14, 0.95], [0.25, 1.01], [0.25, 1.05], [0.15, 1.08], [0.16, 1.13], [0.24, 1.4], [0.21, 1.46], [0.08, 1.5], [0.0005, 1.5]],
};

function lathe(p: P[]) {
  return new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x, y)), 56);
}

function knightHead() {
  const s = new THREE.Shape();
  s.moveTo(-0.2, 0);
  s.splineThru([new THREE.Vector2(-0.23, 0.3), new THREE.Vector2(-0.19, 0.55), new THREE.Vector2(-0.08, 0.74), new THREE.Vector2(-0.02, 0.86)]);
  s.lineTo(0.03, 0.79);
  s.splineThru([new THREE.Vector2(0.12, 0.7), new THREE.Vector2(0.24, 0.55), new THREE.Vector2(0.33, 0.4)]);
  s.splineThru([new THREE.Vector2(0.31, 0.33), new THREE.Vector2(0.22, 0.31), new THREE.Vector2(0.1, 0.36)]);
  s.splineThru([new THREE.Vector2(0.06, 0.24), new THREE.Vector2(0.16, 0.08), new THREE.Vector2(0.2, 0)]);
  s.lineTo(-0.2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: 6, curveSegments: 24 });
  g.translate(0, 0, -0.12);
  g.rotateY(-Math.PI / 2); // nose points toward -z (away from white)
  g.translate(0, 0.38, 0);
  // planar UVs so the wood grain runs up the head
  const pos = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getZ(i) * 1.6 + pos.getX(i) * 0.6, pos.getY(i) * 1.6);
  return g;
}

function makeGeometries() {
  const g: Record<Kind, THREE.BufferGeometry> = {} as never;
  (Object.keys(PROFILES) as Exclude<Kind, "n">[]).forEach((k) => (g[k] = lathe(PROFILES[k])));
  // rook battlements
  const merlons: THREE.BufferGeometry[] = [g.r];
  for (let i = 0; i < 6; i++) {
    const m = new THREE.BoxGeometry(0.09, 0.09, 0.1);
    m.translate(0, 1.11, 0.225);
    m.rotateY((i / 6) * Math.PI * 2);
    merlons.push(m.toNonIndexed());
  }
  g.r = mergeGeometries([g.r.toNonIndexed(), ...merlons.slice(1)], false)!;
  // queen coronet
  const crown: THREE.BufferGeometry[] = [g.q.toNonIndexed()];
  for (let i = 0; i < 10; i++) {
    const b = new THREE.SphereGeometry(0.035, 12, 8);
    b.translate(0, 1.37, 0.19);
    b.rotateY((i / 10) * Math.PI * 2);
    crown.push(b.toNonIndexed());
  }
  g.q = mergeGeometries(crown, false)!;
  // king cross
  const v = new THREE.BoxGeometry(0.07, 0.26, 0.07); v.translate(0, 1.62, 0);
  const h = new THREE.BoxGeometry(0.2, 0.07, 0.07); h.translate(0, 1.65, 0);
  g.k = mergeGeometries([g.k.toNonIndexed(), v.toNonIndexed(), h.toNonIndexed()], false)!;
  // knight: turned base and collar plus a carved head
  const nb = lathe([...base(0.36), [0.24, 0.22], [0.24, 0.32], [0.27, 0.36], [0.22, 0.4], [0.0005, 0.4]]);
  g.n = mergeGeometries([nb.toNonIndexed(), knightHead().toNonIndexed()], false)!;
  for (const k in g) g[k as Kind].computeVertexNormals();
  // keep the hard rim on lathe parts by re-smoothing only the knight head is enough; bishop slit is a separate mesh
  return g;
}

/* ---------- rules (simple: no check, castling or en passant; pawns promote to queens) ---------- */
function moves(board: (Piece | null)[][], p: Piece) {
  const out: [number, number][] = [];
  const at = (f: number, r: number) => (f < 0 || f > 7 || r < 0 || r > 7 ? undefined : board[f][r]);
  const push = (f: number, r: number) => { const o = at(f, r); if (o === undefined) return false; if (!o) { out.push([f, r]); return true; } if (o.white !== p.white) out.push([f, r]); return false; };
  const slide = (dirs: number[][]) => dirs.forEach(([df, dr]) => { for (let i = 1; i < 8 && push(p.f + df * i, p.r + dr * i); i++); });
  const dir = p.white ? 1 : -1;
  switch (p.kind) {
    case "p":
      if (at(p.f, p.r + dir) === null) { out.push([p.f, p.r + dir]); if (!p.moved && at(p.f, p.r + 2 * dir) === null) out.push([p.f, p.r + 2 * dir]); }
      for (const df of [-1, 1]) { const o = at(p.f + df, p.r + dir); if (o && o.white !== p.white) out.push([p.f + df, p.r + dir]); }
      break;
    case "n": [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].forEach(([a, b]) => push(p.f + a, p.r + b)); break;
    case "b": slide([[1, 1], [1, -1], [-1, 1], [-1, -1]]); break;
    case "r": slide([[1, 0], [-1, 0], [0, 1], [0, -1]]); break;
    case "q": slide([[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]); break;
    case "k": [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => push(p.f + a, p.r + b)); break;
  }
  return out;
}
const VALUE: Record<Kind, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

/* ---------- scene ---------- */
export function mountChess(el: HTMLElement, opts: { dark: boolean; onInfo: (i: PieceInfo) => void; onStatus: (s: string) => void; onReady: () => void; onFail: () => void }): ChessApi {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch { opts.onFail(); return { reset() {}, dispose() {} }; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  el.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = "pan-y";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.4;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xfff1dd, 2.6);
  key.position.set(-5, 11, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -6.5, right: 6.5, top: 6.5, bottom: -6.5, near: 1, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  key.shadow.radius = 4;
  scene.add(key, new THREE.HemisphereLight(0xfff6ea, 0x3a2a1e, 0.55));
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0.9);
  rim.position.set(6, 5, -7);
  scene.add(rim);

  /* textures */
  const loader = new THREE.TextureLoader();
  let pending = 0;
  const tex = (name: string, color: boolean) => {
    pending++;
    const t = loader.load(`/models/chess/${name}.webp`, () => { if (--pending === 0) ready(); }, undefined, () => opts.onFail());
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const ash = { map: tex("ash_diff", true), normalMap: tex("ash_nor", false) };
  const walnut = { map: tex("black_walnut_diff", true), normalMap: tex("black_walnut_nor", false) };
  const ebony = { map: tex("flamed_black_diff", true), normalMap: tex("flamed_black_nor", false) };

  const lacquer = (t: { map: THREE.Texture; normalMap: THREE.Texture }, color: number, rough: number, ns = 0.35, coat = 1, coatR = 0.12) =>
    new THREE.MeshPhysicalMaterial({ ...t, color, roughness: rough, clearcoat: coat, clearcoatRoughness: coatR, normalScale: new THREE.Vector2(ns, ns) });
  const mLight = lacquer(ash, 0xfff1dc, 0.6, 0.12, 0.35, 0.35);
  const mDark = lacquer(walnut, 0x7a6352, 0.55, 0.12, 0.35, 0.35);
  const mFrame = lacquer(walnut, 0x6e5545, 0.45, 0.3, 0.8, 0.2);
  const mWhite = lacquer(ash, 0xffe9cc, 0.3, 0.25);
  const mBlack = lacquer(ebony, 0x3a302b, 0.32, 0.25);
  const mFelt = new THREE.MeshStandardMaterial({ color: 0x1d3b2a, roughness: 1 });
  // tech logos: one 8 x 4 atlas, a cream enamel badge with a brass rim on the front of every piece
  const atlas = tex("logos", true);
  atlas.wrapS = atlas.wrapT = THREE.ClampToEdgeWrapping;
  const mEnamel = new THREE.MeshPhysicalMaterial({ color: 0xfbf7ef, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 });
  const mBrass = new THREE.MeshPhysicalMaterial({ color: 0xc9a467, metalness: 0.9, roughness: 0.28 });
  const badgeRim = new THREE.CylinderGeometry(1, 1, 0.05, 40).rotateX(Math.PI / 2);
  const badgeFace = new THREE.CircleGeometry(0.86, 40);
  const logoMats: THREE.MeshStandardMaterial[] = [];
  const logoMat = (i: number) => {
    const t = atlas.clone();
    t.repeat.set(1 / 8, 1 / 4);
    t.offset.set((i % 8) / 8, 1 - (Math.floor(i / 8) + 1) / 4);
    t.needsUpdate = true;
    const m = new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.35, depthWrite: false });
    logoMats.push(m);
    return m;
  };
  const BADGE: Record<Kind, [number, number, number]> = { p: [0.42, 0.3, 0.22], r: [0.55, 0.34, 0.27], n: [0.45, 0.34, 0.3], b: [0.58, 0.32, 0.22], q: [0.7, 0.34, 0.24], k: [0.76, 0.35, 0.25] };
  const VIEW_YAW = 0.9;

  /* board */
  const board = new THREE.Group();
  scene.add(board);
  const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  const squares: THREE.Mesh[] = [];
  for (let f = 0; f < 8; f++) for (let r = 0; r < 8; r++) {
    const g = new THREE.BoxGeometry(SQ, 0.08, SQ);
    const uv = g.attributes.uv, ox = rnd(), oy = rnd(), turn = (f + r) % 2 === 0;
    for (let i = 0; i < uv.count; i++) {
      const u = uv.getX(i) * 0.24, v = uv.getY(i) * 0.24;
      uv.setXY(i, ox + (turn ? v : u), oy + (turn ? u : v));
    }
    const sq = new THREE.Mesh(g, (f + r) % 2 === 1 ? mLight : mDark);
    sq.position.copy(sqPos(f, r)).setY(-0.04);
    sq.receiveShadow = true;
    sq.userData.sq = [f, r];
    board.add(sq);
    squares.push(sq);
  }
  // frame with mitred look, inlay line and a felt underside
  const frameShape = new THREE.Shape();
  const o = 4.62, i0 = 4.02;
  frameShape.moveTo(-o, -o); frameShape.lineTo(o, -o); frameShape.lineTo(o, o); frameShape.lineTo(-o, o); frameShape.lineTo(-o, -o);
  const hole = new THREE.Path();
  hole.moveTo(-i0, -i0); hole.lineTo(-i0, i0); hole.lineTo(i0, i0); hole.lineTo(i0, -i0); hole.lineTo(-i0, -i0);
  frameShape.holes.push(hole);
  const fg = new THREE.ExtrudeGeometry(frameShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 4 });
  fg.rotateX(-Math.PI / 2);
  fg.translate(0, -0.3, 0);
  { const pos = fg.attributes.position, uv = fg.attributes.uv; for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) * 0.12, pos.getZ(i) * 0.12); }
  const frame = new THREE.Mesh(fg, mFrame);
  frame.castShadow = frame.receiveShadow = true;
  board.add(frame);
  const inlay = new THREE.Mesh(new THREE.BoxGeometry(8.1, 0.01, 8.1), new THREE.MeshPhysicalMaterial({ color: 0xc9a467, metalness: 0.85, roughness: 0.3 }));
  inlay.position.y = -0.03;
  board.add(inlay);
  const under = new THREE.Mesh(new THREE.BoxGeometry(9.3, 0.02, 9.3), mFelt);
  under.position.y = -0.34;
  board.add(under);
  // soft contact shadow on the page around the board
  const shadowTex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d")!, gr = x.createRadialGradient(64, 64, 20, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: opts.dark ? 0.9 : 0.55 }));
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = -0.36;
  scene.add(blob);

  /* move markers */
  const dotGeo = new THREE.CircleGeometry(0.13, 32), ringGeo = new THREE.RingGeometry(0.36, 0.45, 48);
  const markMat = new THREE.MeshBasicMaterial({ color: 0xe8b04a, transparent: true, opacity: 0.85, depthWrite: false });
  const selMat = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.55, depthWrite: false });
  const markers = new THREE.Group();
  scene.add(markers);
  const selRing = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.48, 48), selMat);
  selRing.rotation.x = -Math.PI / 2;
  selRing.position.y = 0.006;
  selRing.visible = false;
  scene.add(selRing);

  /* pieces */
  const geos = makeGeometries();
  const slitGeo = new THREE.BoxGeometry(0.018, 0.13, 0.2);
  const pieces: Piece[] = [];
  const grid: (Piece | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));

  function build(kind: Kind, white: boolean, tech: Tech, f: number, r: number, logo: number) {
    const obj = new THREE.Group();
    const m = new THREE.Mesh(geos[kind], white ? mWhite : mBlack);
    m.castShadow = m.receiveShadow = true;
    obj.add(m);
    if (kind === "b") {
      const s = new THREE.Mesh(slitGeo, white ? mBlack : mWhite);
      s.position.set(0, 1.05, 0.09);
      s.rotation.x = 0.55;
      s.rotation.y = Math.PI / 2;
      s.scale.set(1, 1, 0.9);
      obj.add(s);
    }
    const felt = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.004, 32), mFelt);
    felt.position.y = 0.002;
    obj.add(felt);
    if (kind === "n") obj.rotation.y = (white ? 0 : Math.PI) + (f < 4 ? -1 : 1) * (white ? 1 : -1) * 1.1;
    obj.scale.setScalar(1.02);
    const [by, br, bz] = BADGE[kind];
    const badge = new THREE.Group();
    const local = VIEW_YAW - obj.rotation.y;
    badge.position.set(Math.sin(local) * bz, by, Math.cos(local) * bz);
    badge.rotation.y = local;
    badge.rotation.x = -0.12;
    badge.scale.setScalar(br);
    const rimM = new THREE.Mesh(badgeRim, mBrass);
    rimM.castShadow = true;
    const face = new THREE.Mesh(badgeFace, mEnamel);
    face.position.z = 0.026;
    const lg = new THREE.Mesh(badgeFace, logoMat(logo));
    lg.position.z = 0.03;
    lg.scale.setScalar(1.08);
    badge.add(rimM, face, lg);
    obj.add(badge);
    const p: Piece = { kind, white, tech, f, r, obj, lift: 0, target: 0, moved: false, alive: true };
    obj.traverse((c) => (c.userData.piece = p));
    obj.position.copy(sqPos(f, r));
    scene.add(obj);
    pieces.push(p);
    grid[f][r] = p;
  }
  function setup() {
    pieces.splice(0).forEach((p) => scene.remove(p.obj));
    logoMats.splice(0).forEach((m) => { m.map?.dispose(); m.dispose(); });
    grid.forEach((col) => col.fill(null));
    for (let f = 0; f < 8; f++) {
      build(ORDER[f], true, WHITE.back[f], f, 0, f);
      build("p", true, WHITE.pawns[f], f, 1, 8 + f);
      build(ORDER[f], false, BLACK.back[f], f, 7, 16 + f);
      build("p", false, BLACK.pawns[f], f, 6, 24 + f);
    }
    captured = { w: 0, b: 0 };
    busy = false;
    select(null);
  }

  /* interaction */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(9, 9);
  let hover: Piece | null = null, selected: Piece | null = null, legal: [number, number][] = [];
  let captured = { w: 0, b: 0 }, busy = false;
  const anims: { p: Piece; from: THREE.Vector3; to: THREE.Vector3; t: number; dur: number; arc: number; done?: () => void }[] = [];

  function select(p: Piece | null) {
    selected = p;
    markers.clear();
    legal = p ? moves(grid, p) : [];
    for (const [f, r] of legal) {
      const cap = !!grid[f][r];
      const m = new THREE.Mesh(cap ? ringGeo : dotGeo, markMat);
      m.rotation.x = -Math.PI / 2;
      m.position.copy(sqPos(f, r)).setY(0.007);
      markers.add(m);
    }
    selRing.visible = !!p;
    if (p) selRing.position.set(p.obj.position.x, 0.006, p.obj.position.z);
  }

  function animate(p: Piece, to: THREE.Vector3, arcH: number, dur: number, done?: () => void) {
    anims.push({ p, from: p.obj.position.clone(), to, t: 0, dur, arc: arcH, done });
  }

  function capture(v: Piece) {
    v.alive = false;
    grid[v.f][v.r] = null;
    const side = v.white ? captured.w++ : captured.b++;
    const x = v.white ? -5.4 - Math.floor(side / 8) * 0.75 : 5.4 + Math.floor(side / 8) * 0.75;
    const z = v.white ? -3.2 + (side % 8) * 0.82 : 3.2 - (side % 8) * 0.82;
    animate(v, new THREE.Vector3(x, -0.36, z), 1.6, 0.9);
  }

  function play(p: Piece, f: number, r: number, after?: () => void) {
    busy = true;
    const v = grid[f][r];
    grid[p.f][p.r] = null;
    const knight = p.kind === "n";
    animate(p, sqPos(f, r), knight ? 0.9 : 0.35, knight ? 0.65 : 0.5, () => {
      if (v) capture(v);
      p.f = f; p.r = r; p.moved = true;
      grid[f][r] = p;
      if (p.kind === "p" && (r === 7 || r === 0)) { p.kind = "q"; (p.obj.children[0] as THREE.Mesh).geometry = geos.q; }
      thud = 1;
      if (v?.kind === "k") { opts.onStatus(p.white ? "Checkmate in spirit. You took the king." : "Black took your king. Reset to play again."); busy = true; return; }
      busy = false;
      after?.();
    });
  }

  function reply() {
    const options: { p: Piece; f: number; r: number; s: number }[] = [];
    for (const p of pieces) if (p.alive && !p.white) for (const [f, r] of moves(grid, p)) {
      const v = grid[f][r];
      options.push({ p, f, r, s: (v ? VALUE[v.kind] * 10 - VALUE[p.kind] : 0) + Math.random() * 2 + (p.kind === "p" ? 0.5 : 0) });
    }
    if (!options.length) { opts.onStatus("Black has no moves left."); return; }
    options.sort((a, b) => b.s - a.s);
    const m = options[0];
    opts.onInfo({ tech: m.p.tech, kind: m.p.kind, white: false });
    play(m.p, m.f, m.r, () => opts.onStatus("Your move."));
  }

  function pick(e: PointerEvent) {
    const b = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects([...pieces.filter((p) => p.alive).map((p) => p.obj), ...squares], true);
    for (const h of hits) {
      if (h.object.userData.piece) return { piece: h.object.userData.piece as Piece, sq: [(h.object.userData.piece as Piece).f, (h.object.userData.piece as Piece).r] as [number, number] };
      if (h.object.userData.sq) { const [f, r] = h.object.userData.sq as [number, number]; const o = grid[f][r]; return { piece: o && !legal.some(([a, b]) => a === f && b === r) ? o : null, sq: [f, r] as [number, number] }; }
    }
    return null;
  }

  const onMove = (e: PointerEvent) => {
    const b = renderer.domElement.getBoundingClientRect();
    tilt.set(((e.clientX - b.left) / b.width) * 2 - 1, ((e.clientY - b.top) / b.height) * 2 - 1);
    if (e.pointerType !== "mouse") return;
    const h = pick(e);
    const p = h?.piece ?? null;
    if (p !== hover) {
      hover = p;
      renderer.domElement.style.cursor = p || (h && legal.some(([f, r]) => f === h.sq[0] && r === h.sq[1])) ? "pointer" : "default";
      if (p) opts.onInfo({ tech: p.tech, kind: p.kind, white: p.white });
      else if (selected) opts.onInfo({ tech: selected.tech, kind: selected.kind, white: true });
    }
  };
  let downAt = { x: 0, y: 0 };
  const onDown = (e: PointerEvent) => (downAt = { x: e.clientX, y: e.clientY });
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8 || busy) return;
    const h = pick(e);
    if (!h) { select(null); return; }
    const target = legal.find(([f, r]) => f === h.sq[0] && r === h.sq[1]);
    if (selected && target) {
      const p = selected;
      select(null);
      opts.onStatus("Black is thinking...");
      play(p, target[0], target[1], () => setTimeout(reply, 450));
      return;
    }
    if (h.piece) {
      opts.onInfo({ tech: h.piece.tech, kind: h.piece.kind, white: h.piece.white });
      if (h.piece.white) { select(h.piece === selected ? null : h.piece); if (selected) opts.onStatus(legal.length ? "Tap a glowing square to move." : "That piece is blocked. Try another."); }
      else select(null);
    } else select(null);
  };
  const onLeave = () => { hover = null; tilt.set(0, 0); };
  renderer.domElement.addEventListener("pointermove", onMove);
  renderer.domElement.addEventListener("pointerdown", onDown);
  renderer.domElement.addEventListener("pointerup", onUp);
  renderer.domElement.addEventListener("pointerleave", onLeave);

  /* camera */
  const tilt = new THREE.Vector2(), tiltS = new THREE.Vector2();
  let portrait = false;
  const resize = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    portrait = w / h < 1;
    camera.fov = portrait ? 44 : 30;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  resize();

  /* loop */
  let raf = 0, last = performance.now(), intro = 0, thud = 0, alive = true, started = false;
  const look = new THREE.Vector3(0.3, 0, 0.4);
  function ready() {
    if (!alive) return;
    setup();
    opts.onReady();
    opts.onStatus("Tap a white piece to see it, then move it.");
    started = true;
    // opening: e4 then e5
    setTimeout(() => { const p = grid[4][1]; if (p && !busy) play(p, 4, 3, () => setTimeout(() => { const q = grid[4][6]; if (q && !busy) play(q, 4, 4); }, 300)); }, 900);
  }
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!started) return;
    intro = Math.min(1, intro + dt * 0.45);
    const e = 1 - Math.pow(1 - intro, 3);
    tiltS.lerp(tilt, 1 - Math.exp(-dt * 4));
    const t = now / 1000;
    const dist = portrait ? 13.5 : 17.5;
    const yaw = VIEW_YAW + (1 - e) * 0.7 + tiltS.x * 0.12 + Math.sin(t * 0.15) * 0.04;
    const pitch = (portrait ? 0.95 : 0.7) + (1 - e) * -0.2 + tiltS.y * 0.05;
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(look);

    for (let i = anims.length - 1; i >= 0; i--) {
      const a = anims[i];
      a.t = Math.min(1, a.t + dt / a.dur);
      const s = a.t < 0.5 ? 4 * a.t ** 3 : 1 - Math.pow(-2 * a.t + 2, 3) / 2;
      a.p.obj.position.lerpVectors(a.from, a.to, s);
      a.p.obj.position.y += Math.sin(Math.PI * s) * a.arc;
      if (a.t >= 1) { anims.splice(i, 1); a.done?.(); }
    }
    for (const p of pieces) {
      if (!p.alive || anims.some((a) => a.p === p)) continue;
      p.target = p === selected ? 0.32 : p === hover ? 0.14 : 0;
      p.lift += (p.target - p.lift) * (1 - Math.exp(-dt * 12));
      p.obj.position.y = p.lift + (p === selected ? Math.sin(t * 3) * 0.03 : 0);
      p.obj.rotation.z = p === selected ? Math.sin(t * 2) * 0.03 : 0;
    }
    if (selRing.visible) selMat.opacity = 0.4 + Math.sin(t * 4) * 0.15;
    markMat.opacity = 0.65 + Math.sin(t * 4) * 0.2;
    if (thud > 0) { thud = Math.max(0, thud - dt * 5); board.position.y = -Math.sin(thud * Math.PI) * 0.012; }
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(tick);

  return {
    reset: () => { anims.length = 0; setup(); opts.onStatus("Fresh board. Tap a white piece."); opts.onInfo(null); },
    dispose: () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); } });
      [mLight, mDark, mFrame, mWhite, mBlack, mFelt, markMat, selMat].forEach((m) => m.dispose());
      [ash, walnut, ebony].forEach((t) => { t.map.dispose(); t.normalMap.dispose(); });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
