"use client";

import { useEffect, useRef } from "react";
import type { FeatureState } from "@/lib/types";
import type { CSSProperties } from "react";

/** Reading positions on the scale: the needle rests where the reading sits. */
const ANGLE: Record<FeatureState, number> = {
  yes: 40,
  partial: 0,
  no: -40,
  not_applicable: -50,
  not_checked: -58,
};

const TONE: Record<FeatureState, string> = {
  yes: "var(--color-yes)",
  partial: "var(--color-partial)",
  no: "var(--color-no)",
  not_applicable: "var(--color-unknown)",
  not_checked: "var(--color-unknown)",
};

function polar(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [32 + Math.sin(rad) * r, 32 - Math.cos(rad) * r];
}

function Scale() {
  const ticks = [];
  for (let i = 0; i < 9; i += 1) {
    const deg = -50 + (i * 100) / 8;
    const major = i % 4 === 0;
    const [x1, y1] = polar(deg, 27);
    const [x2, y2] = polar(deg, major ? 19 : 22.5);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={major ? 1.6 : 1}
        strokeLinecap="round"
      />,
    );
  }
  const [sx, sy] = polar(-50, 27);
  const [ex, ey] = polar(50, 27);
  return (
    <g>
      <path d={`M${sx} ${sy} A27 27 0 0 1 ${ex} ${ey}`} stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
      {ticks}
    </g>
  );
}

/**
 * A calibrated reading. The needle parks off-scale, sweeps past the value
 * once when the row enters view, and settles. Without JS it simply rests at
 * the reading. Decorative: the state badge beside it carries the words.
 */
export function Gauge({
  state,
  value,
  size = 44,
  idle = false,
}: {
  state?: FeatureState;
  /** 0..1 drives the needle instead of a state (used by the hero index). */
  value?: number;
  size?: number;
  idle?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("swept");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const angle = value !== undefined ? Math.round(value * 100 - 50) : ANGLE[state ?? "not_checked"];
  const tone = value !== undefined ? "var(--color-accent)" : TONE[state ?? "not_checked"];
  const park = angle <= -55 ? angle : -58;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="inline-block text-line-strong"
      style={{ "--needle": `${angle}deg`, "--needle-park": `${park}deg` } as CSSProperties}
    >
      <svg viewBox="0 0 64 64" width={size} height={size} fill="none">
        <Scale />
        <g className={idle ? "bench-idle" : undefined}>
          <g className="needle">
            <line x1="32" y1="34" x2="32" y2="14" stroke={tone} strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </g>
        <circle cx="32" cy="32" r="3.2" fill="var(--color-ink)" />
        <circle cx="32" cy="32" r="1.2" fill="var(--color-surface)" />
      </svg>
    </span>
  );
}
