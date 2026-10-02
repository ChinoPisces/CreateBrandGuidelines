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
      return Math.max(0, Math.min(1, 0.5 + (visibleProgress - 0.5) * 0.96));
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
        container, renderer: "canvas", loop: false, autoplay: false, animationData: data,
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
