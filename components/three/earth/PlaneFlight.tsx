"use client";
// components/three/earth/PlaneFlight.tsx
// When a message is sent, a folded paper plane takes off from the Send button and flies to the globe
// (or off the top of the screen when there is no globe on the page). A short-lived canvas, freed when it lands.
import { useEffect } from "react";

export function PlaneFlight() {
  useEffect(() => {
    const go = async (e: Event) => {
      const from = (e as CustomEvent<{ x: number; y: number }>).detail;
      const THREE = await import("three");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const globe = document.querySelector("[data-globe]") as HTMLElement | null;
      if (globe) globe.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      await new Promise((r) => setTimeout(r, globe ? 450 : 0));
      const gr = globe?.getBoundingClientRect();
      const to = gr ? { x: gr.left + gr.width / 2, y: gr.top + gr.height * 0.44 } : { x: window.innerWidth * 0.85, y: -80 };
      const start = { x: from.x, y: Math.min(from.y, window.innerHeight - 40) };

      const cv = document.createElement("canvas");
      Object.assign(cv.style, { position: "fixed", inset: "0", width: "100vw", height: "100vh", pointerEvents: "none", zIndex: "60" });
      document.body.appendChild(cv);
      const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      const W = window.innerWidth, H = window.innerHeight;
      const camera = new THREE.OrthographicCamera(0, W, 0, -H, -500, 500); // pixel space, y down as negative
      const scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const dl = new THREE.DirectionalLight(0xffffff, 1.6);
      dl.position.set(-1, 2, 3);
      scene.add(dl);

      // a classic dart: two wings and a keel, slightly folded
      const s = 26;
      const g = new THREE.BufferGeometry();
      const v = [
        0, 0, 0, -2.2 * s, 0.9 * s, 0.15 * s, -2.0 * s, 0, 0.5 * s,   // right wing
        0, 0, 0, -2.0 * s, 0, 0.5 * s, -2.2 * s, -0.9 * s, 0.15 * s, // left wing
        0, 0, 0, -2.0 * s, 0, 0.5 * s, -2.0 * s, 0, -0.25 * s,       // keel
      ];
      g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
      g.computeVertexNormals();
      const plane = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, side: THREE.DoubleSide, flatShading: true }));
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: 0xd8d8d8 }));
      plane.add(edge);
      scene.add(plane);
      // a fading trail
      const N = 40;
      const trailPos = new Float32Array(N * 3);
      const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: 0xfc6401, dashSize: 6, gapSize: 6, transparent: true, opacity: 0.8 }));
      trail.geometry.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
      scene.add(trail);

      // a loop-the-loop arc from the button to the target
      const p0 = new THREE.Vector3(start.x, -start.y, 0), p3 = new THREE.Vector3(to.x, -to.y, 0);
      const p1 = new THREE.Vector3(start.x + 220, -start.y + 260, 120), p2 = new THREE.Vector3(to.x - 260, -to.y - 200, 60);
      const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
      const dur = reduce ? 0.6 : 1.9;
      const t0 = performance.now();
      const hist: InstanceType<typeof THREE.Vector3>[] = [];
      const tick = () => {
        const k = Math.min(1, (performance.now() - t0) / 1000 / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const p = curve.getPoint(e), d = curve.getTangent(Math.min(0.999, e + 0.001));
        plane.position.copy(p);
        plane.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), d.normalize());
        plane.rotateX(Math.sin(k * Math.PI * 2) * 0.6);
        plane.scale.setScalar(1 - (globe ? k * 0.75 : 0));
        hist.push(p.clone());
        if (hist.length > N) hist.shift();
        for (let i = 0; i < N; i++) { const q = hist[Math.max(0, hist.length - N + i)] ?? p; trailPos.set([q.x, q.y, q.z - 1], i * 3); }
        trail.geometry.attributes.position.needsUpdate = true;
        trail.computeLineDistances();
        (trail.material as InstanceType<typeof THREE.LineDashedMaterial>).opacity = 0.8 * (1 - k * 0.6);
        renderer.render(scene, camera);
        if (k < 1) requestAnimationFrame(tick);
        else {
          if (globe) window.dispatchEvent(new Event("globe:arrive"));
          renderer.dispose(); g.dispose(); cv.remove();
        }
      };
      requestAnimationFrame(tick);
    };
    window.addEventListener("contact:sent", go);
    return () => window.removeEventListener("contact:sent", go);
  }, []);
  return null;
}
