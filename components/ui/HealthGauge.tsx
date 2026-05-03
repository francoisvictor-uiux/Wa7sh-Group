"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { healthBand } from "@/lib/mock/suppliers";

interface HealthGaugeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  /** Hide the score number — used when the parent renders its own label. */
  bare?: boolean;
  className?: string;
}

const dimensions: Record<NonNullable<HealthGaugeProps["size"]>, {
  px: number;
  stroke: number;
  fontPx: number;
  labelPx: number;
}> = {
  sm: { px: 56,  stroke: 5, fontPx: 16, labelPx: 9 },
  md: { px: 96,  stroke: 7, fontPx: 26, labelPx: 10 },
  lg: { px: 168, stroke: 10, fontPx: 48, labelPx: 12 },
};

const bandToToken: Record<ReturnType<typeof healthBand>, {
  ring: string;
  text: string;
  hintAr: string;
}> = {
  good:     { ring: "var(--status-success)",  text: "text-status-success",  hintAr: "ممتاز" },
  ok:       { ring: "var(--brand-primary)",   text: "text-brand-primary",   hintAr: "جيد" },
  risk:     { ring: "var(--status-warning)",  text: "text-status-warning",  hintAr: "مخاطر" },
  critical: { ring: "var(--status-danger)",   text: "text-status-danger",   hintAr: "حرج" },
};

/**
 * HealthGauge — radial 0–100 dial. Value renders centre-aligned with
 * a band hint underneath. Track sits at 28% opacity of the band colour
 * so the dial reads even on dark and light surfaces.
 *
 * Geometry: 270° sweep (-225° start → +45° end) leaves a notch at the
 * bottom for the hint label, which mirrors the candlelit-hall feel of
 * the broader system rather than a flat donut.
 */
export function HealthGauge({
  value,
  size = "md",
  bare = false,
  className,
}: HealthGaugeProps) {
  const dim = dimensions[size];
  const band = healthBand(value);
  const tone = bandToToken[band];

  const cx = dim.px / 2;
  const cy = dim.px / 2;
  const r = (dim.px - dim.stroke) / 2 - 2;

  const startAngle = -225;
  const endAngle = 45;
  const sweep = endAngle - startAngle;

  const fraction = Math.max(0, Math.min(100, value)) / 100;
  const valueAngle = startAngle + sweep * fraction;

  const trackD = describeArc(cx, cy, r, startAngle, endAngle);
  const valueD = describeArc(cx, cy, r, startAngle, valueAngle);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: dim.px, height: dim.px }}
    >
      <svg
        width={dim.px}
        height={dim.px}
        viewBox={`0 0 ${dim.px} ${dim.px}`}
        aria-hidden
      >
        <path
          d={trackD}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.14}
          strokeWidth={dim.stroke}
          strokeLinecap="round"
          className="text-text-tertiary"
        />
        <path
          d={valueD}
          fill="none"
          stroke={tone.ring}
          strokeWidth={dim.stroke}
          strokeLinecap="round"
          style={{
            transition: "all 480ms cubic-bezier(0.16, 1, 0.3, 1)",
            color: tone.ring,
          }}
        />
      </svg>

      {!bare && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <span
            className={cn("font-bold tabular tracking-tight leading-none", tone.text)}
            style={{ fontSize: dim.fontPx }}
          >
            {Math.round(value)}
          </span>
          <span
            className="text-text-tertiary tracking-[0.16em] uppercase mt-1"
            style={{ fontSize: dim.labelPx }}
          >
            {tone.hintAr}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- arc geometry ---------- */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  if (Math.abs(end - start) < 0.001) {
    const p = polarToCartesian(cx, cy, r, start);
    return `M ${p.x} ${p.y}`;
  }
  const startPt = polarToCartesian(cx, cy, r, start);
  const endPt = polarToCartesian(cx, cy, r, end);
  const largeArc = end - start <= 180 ? 0 : 1;
  return [
    "M", startPt.x, startPt.y,
    "A", r, r, 0, largeArc, 1, endPt.x, endPt.y,
  ].join(" ");
}
