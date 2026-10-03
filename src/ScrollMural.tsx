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

type ScrollMuralProps = {
  source?: string;
  renderer?: "canvas" | "svg";
  label?: string;
  aspectRatio?: string;
  reverse?: boolean;
  startOffset?: number;
  scrollSpeed?: number;
  ambientSmoke?: boolean;
};

export default function ScrollMural({
  source = "media/Mural_CA.json",
  renderer = "canvas",
  label = "Chibi Anime Tutenramen mural animated by scrolling",
  aspectRatio = "3840 / 1950",
  reverse = true,
  startOffset = 0.25,
  scrollSpeed = 4 / 3,
  ambientSmoke = false,
}: ScrollMuralProps) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = frame.current;
    if (!container) return;
    const controller = new AbortController();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const scrollAnimations: Animation[] = [];
    const animationInstances: Animation[] = [];
    let smokeAnimation: Animation | undefined;
    let smokeStarted = 0;
    let disposed = false;
    let ready = false;
    let request = 0;
    let current = 0;
    let previousTime = 0;
    const progress = () => {
      const bounds = container.getBoundingClientRect();
      const visibleProgress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      return Math.max(0, Math.min(1, 0.5 + (visibleProgress - 0.5) * scrollSpeed));
    };
    const render = (time: number) => {
      request = 0;
      if (!animation || !ready || disposed) return;
      const target = reducedMotion.matches ? 0 : progress();
      const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      current += (target - current) * (1 - Math.exp(-delta / 70));
      if (Math.abs(target - current) < 0.0005) current = target;
      const frameProgress = Math.min(1, startOffset + current);
      for (const item of scrollAnimations) {
        item.goToAndStop((reverse ? 1 - frameProgress : frameProgress) * Math.max(0, item.totalFrames - 1), true);
      }
      if (smokeAnimation) {
        if (!smokeStarted) smokeStarted = time;
        // Advance in one direction, then restart the supplied smoke sequence.
        const smokeProgress = reducedMotion.matches ? 0 : ((time - smokeStarted) % 3000) / 3000;
        smokeAnimation.goToAndStop(smokeProgress * Math.max(0, smokeAnimation.totalFrames - 1), true);
      }
      if (current !== target || (smokeAnimation && !reducedMotion.matches)) request = requestAnimationFrame(render);
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(render); };
    Promise.all([
      loadRuntime(),
      fetch(`${import.meta.env.BASE_URL}${source}`, { signal: controller.signal })
        .then(response => { if (!response.ok) throw new Error("Animation unavailable"); return response.json(); }),
    ]).then(([lottie, data]) => {
      if (disposed) return;
      const smokeIndices = ambientSmoke
        ? data.layers.flatMap((layer: { ty: number; nm: string }, index: number) =>
          layer.ty === 4 && ["Shape Layer 1", "Shape Layer 2"].includes(layer.nm) ? [index] : [])
        : [];
      const groups = smokeIndices.length
        ? [
          { layers: data.layers.slice(Math.max(...smokeIndices) + 1), smoke: false },
          { layers: data.layers.filter((_: unknown, index: number) => smokeIndices.includes(index)), smoke: true },
          { layers: data.layers.slice(0, Math.min(...smokeIndices)), smoke: false },
        ]
        : [{ layers: data.layers, smoke: false }];
      let loaded = 0;
      for (const group of groups) {
        const surface = document.createElement("div");
        Object.assign(surface.style, { position: "absolute", inset: "0", pointerEvents: "none" });
        container.appendChild(surface);
        const item = lottie.loadAnimation({
          container: surface, renderer, loop: false, autoplay: false,
          animationData: { ...data, layers: group.layers },
          rendererSettings: { preserveAspectRatio: "xMidYMid meet", clearCanvas: true },
        });
        animationInstances.push(item);
        if (group.smoke) smokeAnimation = item;
        else scrollAnimations.push(item);
        animation = item;
        item.addEventListener("DOMLoaded", () => {
          loaded += 1;
          if (loaded !== groups.length) return;
          ready = true;
          current = reducedMotion.matches ? 0 : progress();
          schedule();
        });
      }
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
      animationInstances.forEach(item => item.destroy());
      container.replaceChildren();
    };
  }, [source, renderer, reverse, startOffset, scrollSpeed, ambientSmoke]);
  return <div ref={frame} className="mural-animation" style={{ aspectRatio, position: "relative" }} role="img" aria-label={label} />;
}
