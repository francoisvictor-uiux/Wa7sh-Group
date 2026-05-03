"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** Array of image src paths. Drop them in /public and pass relative URLs. */
  images?:    string[];
  /** Caption per slide, optional. Same length as images or shorter. */
  captions?:  string[];
  /** Auto-advance interval in ms. Default 4500. Set 0 to disable. */
  interval?:  number;
  className?: string;
}

/**
 * LoginCarousel — auto-fading image rotator for the left side of the
 * desktop login screen. When `images` is empty (or undefined), shows a
 * dashed placeholder so the layout doesn't collapse.
 *
 * Honors `prefers-reduced-motion` — falls back to the first slide,
 * no auto-advance, no fade.
 */
export function LoginCarousel({
  images, captions, interval = 4500, className,
}: Props) {
  const list = images ?? [];
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (list.length <= 1 || interval <= 0 || reduceMotion) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % list.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [list.length, interval, reduceMotion]);

  // Empty state — clear placeholder so designers know where art goes
  if (list.length === 0) {
    return (
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-bg-surface",
          className,
        )}
      >
        <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-border-default flex flex-col items-center justify-center text-center gap-2 px-8">
          <div className="w-14 h-14 rounded-2xl bg-bg-surface-raised flex items-center justify-center mb-2">
            <ImageIcon className="w-6 h-6 text-text-tertiary" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-text-secondary tracking-tight">
            مساحة للصور
          </p>
          <p className="text-xs text-text-tertiary leading-relaxed max-w-xs">
            ضع صورك في <span className="font-mono">public/login/</span> ثم مرّرها لـ
            <span className="font-mono">{" "}LoginCarousel images=&#123;…&#125;</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-bg-surface",
        className,
      )}
      aria-roledescription="carousel"
    >
      {list.map((src, i) => {
        const isActive = i === active;
        return (
          <div
            key={src + i}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity",
              reduceMotion ? "duration-0" : "duration-1000 ease-out-expo",
              isActive ? "opacity-100" : "opacity-0",
            )}
          >
            <img
              src={src}
              alt={captions?.[i] ?? ""}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
            {captions?.[i] && (
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm font-medium text-text-primary tracking-tight max-w-md bg-bg-surface/85 backdrop-blur-sm border border-border-subtle rounded-lg px-3 py-2 inline-block">
                  {captions[i]}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Slide indicators */}
      {list.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface/75 backdrop-blur-sm border border-border-subtle">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`الانتقال للصورة ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-fast",
                i === active
                  ? "w-6 bg-brand-primary"
                  : "w-1.5 bg-text-tertiary/40 hover:bg-text-tertiary/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
