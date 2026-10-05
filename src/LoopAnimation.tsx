import { useEffect, useRef } from "react";
import { loadRuntime } from "./ScrollMural";

export default function LoopAnimation({ source, label, pingPong = false, scale = 1, frameByFrame = false }: { source: string; label: string; pingPong?: boolean; scale?: number; frameByFrame?: boolean }) {
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
    let animation: { totalFrames: number; addEventListener: (name: string, callback: () => void) => void; destroy: () => void; play: () => void; pause: () => void; goToAndStop: (frame: number, isFrame: boolean) => void; setSubframe?: (enabled: boolean) => void } | undefined;
    const render = (time: number) => {
      if (!animation || disposed || reduced.matches) return;
      if (!started) started = time;
      const progress = ((time - started) % (duration * (pingPong ? 2 : 1))) / duration;
      const frame = frameByFrame
        ? Math.min(animation.totalFrames - 1, Math.floor(progress * animation.totalFrames))
        : (pingPong ? (1 - Math.cos(Math.PI * progress)) / 2 : progress) * Math.max(0, animation.totalFrames - 1);
      animation.goToAndStop(frame, true);
      request = requestAnimationFrame(render);
    };
    const syncMotion = () => {
      cancelAnimationFrame(request);
      started = 0;
      if (reduced.matches) animation?.goToAndStop(0, true);
      else if (pingPong || frameByFrame) request = requestAnimationFrame(render);
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
      if (source.includes("sun_ChibiAnime")) {
        const cycle = (data.op - data.ip) / 2;
        const accelerateSmile = (value: any): void => {
          if (!value || typeof value !== "object") return;
          if (value.a === 1 && Array.isArray(value.k) && value.k.every((key: any) => typeof key.t === "number")) {
            const keys = value.k.map((key: any) => ({ ...key, t: key.t / 2 }));
            value.k = [...keys, ...keys.map((key: any) => ({ ...key, t: key.t + cycle }))];
            return;
          }
          Object.values(value).forEach(accelerateSmile);
        };
        data.layers.filter((layer: any) => ["tongue", "mouth", "mouth 2"].includes(layer.nm)).forEach(accelerateSmile);
      }
      animation = lottie.loadAnimation({
        container, renderer: pingPong ? "canvas" : "svg", loop: !pingPong && !frameByFrame, autoplay: !reduced.matches && !pingPong && !frameByFrame,
        animationData: data, rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      animation.setSubframe?.(!frameByFrame);
      duration = ((data.op - data.ip) / data.fr) * 1000 / (pingPong ? 2.4 : 1);
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
  }, [source, pingPong, frameByFrame]);
  return <div ref={surface} className="sun-animation" style={{ transform: `scale(${scale})` }} role="img" aria-label={label} />;
}
