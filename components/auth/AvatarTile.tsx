"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarTileProps {
  name: string;
  /** Arabic UI convention: prefer the first name in the avatar, not initials.
   *  Single Arabic letters look orphaned because glyphs are designed to
   *  connect to their neighbours in word context. Override only when needed. */
  displayLabel?: string;
  imageSrc?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "user" | "add";
}

export function AvatarTile({
  name,
  displayLabel,
  imageSrc,
  selected,
  onClick,
  variant = "user",
}: AvatarTileProps) {
  // First name is the elegant Arabic-UI default — connected glyphs read
  // naturally inside the avatar circle. Trims to 6 chars max for very long names.
  const firstName = name.split(" ")[0] ?? name;
  const labelInside =
    displayLabel ||
    (firstName.length > 6 ? firstName.slice(0, 6) : firstName);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center gap-3",
        "transition-all duration-normal ease-out-expo",
        "focus-visible:outline-none"
      )}
    >
      <div
        className={cn(
          "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full",
          "transition-all duration-normal ease-out-expo",
          selected
            ? "ring-2 ring-brand-primary ring-offset-4 ring-offset-bg-canvas"
            : "ring-1 ring-border ring-offset-2 ring-offset-bg-canvas",
          "group-hover:ring-brand-primary group-hover:ring-2",
          "group-active:scale-95"
        )}
      >
        {/* Decorative double ring — fine gold hairline echoes mashrabiya */}
        {selected && (
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full border border-brand-primary/30 animate-fade-in"
          />
        )}

        <div
          className={cn(
            "flex items-center justify-center w-full h-full rounded-full overflow-hidden",
            variant === "add"
              ? "bg-bg-surface border-2 border-dashed border-border"
              : "bg-bg-surface-raised"
          )}
        >
          {variant === "add" ? (
            <Plus
              className="w-7 h-7 text-text-tertiary group-hover:text-brand-primary transition-colors"
              strokeWidth={1.5}
            />
          ) : imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className={cn(
                "text-lg sm:text-xl font-medium tracking-tight",
                "text-brand-primary"
              )}
            >
              {labelInside}
            </span>
          )}
        </div>
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-fast",
          selected ? "text-text-primary" : "text-text-secondary",
          "group-hover:text-text-primary"
        )}
      >
        {variant === "add" ? "آخر" : name}
      </span>
    </button>
  );
}
