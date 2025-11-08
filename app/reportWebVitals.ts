import type { NextWebVitalsMetric } from "next/dist/shared/lib/utils";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (typeof window === "undefined") return;
  if (metric.name !== "LCP" && metric.name !== "CLS") return;

  const logMetric = () => {
    const path = window.location.pathname;
    const rounded = Math.round(metric.value * 1000) / 1000;
    console.log(`[WebVitals] ${metric.name} @ ${path}: ${rounded}`);
  };

  if (typeof (window as any).requestIdleCallback === "function") {
    (window as any).requestIdleCallback(logMetric);
  } else {
    window.setTimeout(logMetric, 0);
  }
}
