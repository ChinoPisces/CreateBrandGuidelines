import { useEffect, useRef } from "react";

type Animation = {
  totalFrames: number;
  goToAndStop: (frame: number, isFrame: boolean) => void;
  addEventListener: (name: string, callback: () => void) => void;
  destroy: () => void;
};
type Lottie = { loadAnimation: (options: Record<string, unknown>) => Animation };
let runtimePromise: Promise<Lottie> | undefined;

function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = new Promise<Lottie>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.13.0/lottie.min.js";
      script.onload = () => resolve((window as unknown as { lottie: Lottie }).lottie);
      script.onerror = () => { runtimePromise = undefined; reject(new Error("Animation unavailable")); };
      document.head.appendChild(script);
    });
  }
  return runtimePromise;
}

type TransformKeyframe = {
  t: number;
  s?: number[];
  i?: { x: number; y: number };
  o?: { x: number; y: number };
};
type AnimatedTransform = { a: number; k: number[] | TransformKeyframe[] };
type MuralData = {
  ip: number;
  op: number;
  layers: Array<{ nm: string; ks: { p?: AnimatedTransform; s?: AnimatedTransform } }>;
};

// Use the outward half of each loop as continuous, linear depth movement.
function prepareParallax(data: MuralData) {
  const lastFrame = data.op - 1;
  const depthStrength: Record<string, number> = {
    foregroundPlants: 3.2,
    peopleAndGods: 2.4,
    riverPlants: 2.2,
    blueLotus: 1.8,
    distantTrees: 1.2,
  };
  for (const layer of data.layers) {
    for (const property of [layer.ks.p, layer.ks.s]) {
      if (!property || property.a !== 1) continue;
      const keys = property.k as TransformKeyframe[];
      const start = keys[0]?.s;
      if (!start) continue;
      const peak = keys.reduce((best, key) => {
        const distance = (values?: number[]) => values
          ? values.reduce((sum, value, index) => sum + Math.abs(value - start[index]), 0)
          : 0;
        return distance(key.s) > distance(best.s) ? key : best;
      }, keys[0]);
      if (!peak.s) continue;
      const strength = property === layer.ks.p ? (depthStrength[layer.nm] ?? 1) : 1;
      const end = peak.s.map((value, index) => start[index] + (value - start[index]) * strength);
      property.k = [
        { t: data.ip, s: start, o: { x: 0.333, y: 0.333 }, i: { x: 0.667, y: 0.667 } },
        { t: lastFrame, s: end },
      ];
    }
  }
  return data;
}

export default function ScrollMural() {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = frame.current;
    if (!container) return;
    const controller = new AbortController();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    let disposed = false;
    let ready = false;
    let request = 0;
    let current = 0;
    let previousTime = 0;
    const progress = () => {
      const bounds = container.getBoundingClientRect();
      const visibleProgress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      return Math.max(0, Math.min(1, visibleProgress * 0.672));
    };
    const render = (time: number) => {
      request = 0;
      if (!animation || !ready || disposed) return;
      const target = reducedMotion.matches ? 0 : progress();
      const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      current += (target - current) * (1 - Math.exp(-delta / 70));
      if (Math.abs(target - current) < 0.0005) current = target;
      const frameProgress = Math.min(1, 0.15 + current);
      animation.goToAndStop(frameProgress * Math.max(0, animation.totalFrames - 1), true);
      if (current !== target) request = requestAnimationFrame(render);
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(render); };
    Promise.all([
      loadRuntime(),
      fetch(`${import.meta.env.BASE_URL}media/Mural_CA.json`, { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error("Animation unavailable"); return response.json(); }),
    ]).then(([lottie, data]) => {
      if (disposed) return;
      animation = lottie.loadAnimation({
        container, renderer: "canvas", loop: false, autoplay: false, animationData: prepareParallax(data),
        rendererSettings: { preserveAspectRatio: "xMidYMid meet", clearCanvas: true },
      });
      animation.addEventListener("DOMLoaded", () => {
        ready = true;
        current = reducedMotion.matches ? 0 : progress();
        schedule();
      });
    }).catch(error => { if (!disposed && error.name !== "AbortError") console.error(error); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(request);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      animation?.destroy();
    };
  }, []);
  return <div ref={frame} className="mural-animation" role="img" aria-label="Chibi Anime Tutenramen mural animated by scrolling" />;
}
