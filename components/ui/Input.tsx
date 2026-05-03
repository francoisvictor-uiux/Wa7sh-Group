"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      helper,
      error,
      leadingIcon,
      trailingIcon,
      className,
      id,
      ...props
    },
    ref
  ) {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-secondary tracking-tight"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center h-12 rounded-sm transition-colors duration-fast ease-out-expo",
            "bg-bg-surface border border-border",
            "focus-within:border-border-focus focus-within:shadow-glow-brand",
            error && "border-status-danger focus-within:border-status-danger"
          )}
        >
          {leadingIcon && (
            <span className="absolute right-4 text-text-tertiary pointer-events-none">
              {leadingIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-full bg-transparent outline-none",
              "px-4 text-base text-text-primary placeholder:text-text-tertiary",
              leadingIcon && "pr-12",
              trailingIcon && "pl-12",
              className
            )}
            {...props}
          />
          {trailingIcon && (
            <span className="absolute left-3 text-text-tertiary">
              {trailingIcon}
            </span>
          )}
        </div>
        {(error || helper) && (
          <span
            className={cn(
              "text-xs",
              error ? "text-status-danger" : "text-text-tertiary"
            )}
          >
            {error || helper}
          </span>
        )}
      </div>
    );
  }
);
