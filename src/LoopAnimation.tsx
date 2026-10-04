import { useEffect, useRef } from "react";
import { loadRuntime } from "./ScrollMural";

export default function LoopAnimation({ source, label, pingPong = false, scale = 1 }: { source: string; label: string; pingPong?: boolean; scale?: number }) {
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = surface.current;
    if (!container) return;
    const controller = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let request = 0;
    let started = 0;
    let duration = 5000;
    let animation: { totalFrames: number; addEventListener: (name: string, callback: () => void) => void; destroy: () => void; play: () => void; pause: () => void; goToAndStop: (frame: number, isFrame: boolean) => void } | undefined;
    const render = (time: number) => {
      if (!animation || disposed || reduced.matches) return;
      if (!started) started = time;
      const progress = ((time - started) % (duration * 2)) / duration;
      const frame = (progress <= 1 ? progress : 2 - progress) * Math.max(0, animation.totalFrames - 1);
      animation.goToAndStop(frame, true);
      request = requestAnimationFrame(render);
    };
    const syncMotion = () => {
      cancelAnimationFrame(request);
      started = 0;
      if (reduced.matches) animation?.goToAndStop(0, true);
      else if (pingPong) request = requestAnimationFrame(render);
      else animation?.play();
    };
    Promise.all([
      loadRuntime(),
      fetch(`${import.meta.env.BASE_URL}${source}`, { signal: controller.signal }).then(response => {
        if (!response.ok) throw new Error("Animation unavailable");
        return response.json();
      }),
    ]).then(([lottie, data]) => {
      if (disposed) return;
      animation = lottie.loadAnimation({
        container, renderer: "svg", loop: !pingPong, autoplay: !reduced.matches && !pingPong,
        animationData: data, rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      duration = ((data.op - data.ip) / data.fr) * 1000;
      animation.addEventListener("DOMLoaded", syncMotion);
    }).catch(error => { if (!disposed && error.name !== "AbortError") console.error(error); });
    reduced.addEventListener("change", syncMotion);
    return () => {
      disposed = true;
      controller.abort();
      reduced.removeEventListener("change", syncMotion);
      cancelAnimationFrame(request);
      animation?.destroy();
    };
  }, [source, pingPong]);
  return <div ref={surface} className="sun-animation" style={{ transform: `scale(${scale})` }} role="img" aria-label={label} />;
}
