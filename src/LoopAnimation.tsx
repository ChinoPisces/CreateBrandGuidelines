import { useEffect, useRef } from "react";
import { loadRuntime } from "./ScrollMural";

export default function LoopAnimation({ source, label }: { source: string; label: string }) {
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = surface.current;
    if (!container) return;
    const controller = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let animation: { destroy: () => void; play: () => void; pause: () => void; goToAndStop: (frame: number, isFrame: boolean) => void } | undefined;
    const syncMotion = () => {
      if (reduced.matches) animation?.goToAndStop(0, true);
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
        container, renderer: "svg", loop: true, autoplay: !reduced.matches,
        animationData: data, rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      syncMotion();
    }).catch(error => { if (!disposed && error.name !== "AbortError") console.error(error); });
    reduced.addEventListener("change", syncMotion);
    return () => {
      disposed = true;
      controller.abort();
      reduced.removeEventListener("change", syncMotion);
      animation?.destroy();
    };
  }, [source]);
  return <div ref={surface} className="sun-animation" role="img" aria-label={label} />;
}
