"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, X, Keyboard, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    BarcodeDetector?: any;
    jsQR?: (data: Uint8ClampedArray, w: number, h: number) => { data: string } | null;
  }
}

interface QRScannerProps {
  onScan: (value: string) => void;
  onManual: () => void;
  className?: string;
}

type ScanState = "idle" | "starting" | "scanning" | "denied" | "error";

export function QRScanner({ onScan, onManual, className }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);

  const [state, setState] = useState<ScanState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [usingFallback, setUsingFallback] = useState(false);

  /* ── start camera + detector ── */
  async function start() {
    setState("starting");
    setErrorMsg("");
    stoppedRef.current = false;

    try {
      // Pick rear camera if available
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      // Try native BarcodeDetector first
      let detector: any = null;
      if (typeof window.BarcodeDetector === "function") {
        try {
          const formats = await window.BarcodeDetector.getSupportedFormats();
          if (formats.includes("qr_code")) {
            detector = new window.BarcodeDetector({ formats: ["qr_code"] });
          }
        } catch {}
      }

      // Fallback: load jsQR from CDN
      if (!detector) {
        setUsingFallback(true);
        if (!window.jsQR) {
          const mod: any = await import(/* webpackIgnore: true */ "https://esm.sh/jsqr@1.4.0");
          window.jsQR = mod.default || mod;
        }
      }

      detectorRef.current = detector;
      setState("scanning");
      tick();
    } catch (err: any) {
      console.warn("Camera error", err);
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setState("denied");
      } else {
        setState("error");
        setErrorMsg(err?.message ?? "تعذّر فتح الكاميرا");
      }
    }
  }

  /* ── detection loop ── */
  async function tick() {
    if (stoppedRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    try {
      // Native detector path
      if (detectorRef.current) {
        const codes = await detectorRef.current.detect(video);
        if (codes && codes.length > 0 && codes[0].rawValue) {
          handleHit(codes[0].rawValue);
          return;
        }
      } else if (window.jsQR) {
        // jsQR path — draw frame to canvas first
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const img = ctx.getImageData(0, 0, w, h);
            const code = window.jsQR(img.data, w, h);
            if (code?.data) {
              handleHit(code.data);
              return;
            }
          }
        }
      }
    } catch (err) {
      // Detection errors shouldn't kill the loop
      console.warn("scan tick error", err);
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  function handleHit(value: string) {
    stop();
    onScan(value);
  }

  /* ── teardown ── */
  function stop() {
    stoppedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState("idle");
  }

  // Auto-start on mount
  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative rounded-xl overflow-hidden bg-black", className)}>
      {/* Video */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="w-full aspect-square object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Scanning frame overlay */}
      {state === "scanning" && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-[60%] aspect-square">
            {/* Corner markers */}
            <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-md" />
            <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-md" />
            <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-md" />
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-md" />
            {/* Scanning line */}
            <span
              className="absolute inset-x-0 h-0.5 bg-brand-primary shadow-[0_0_12px_var(--brand-primary)]"
              style={{ animation: "qrScan 2s ease-in-out infinite alternate" }}
            />
          </div>
          <style jsx global>{`
            @keyframes qrScan {
              0%   { top: 0%; }
              100% { top: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Status bar at top */}
      {state === "scanning" && (
        <div className="absolute top-0 inset-x-0 bg-black/60 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span className="text-xs font-medium">جاري المسح...</span>
            {usingFallback && <span className="text-[9px] text-white/50 mr-1">(احتياطي)</span>}
          </div>
          <button type="button" onClick={onManual} className="inline-flex items-center gap-1 text-[11px] text-white/80 hover:text-white">
            <Keyboard className="w-3 h-3" strokeWidth={2} />
            إدخال يدوي
          </button>
        </div>
      )}

      {state === "starting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
          <span className="w-10 h-10 rounded-full border-3 border-white/30 border-t-white animate-spin" />
          <p className="text-sm">جاري فتح الكاميرا...</p>
        </div>
      )}

      {state === "denied" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white text-center px-6">
          <div className="w-12 h-12 rounded-full bg-status-danger/20 flex items-center justify-center">
            <CameraOff className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-bold">تم رفض إذن الكاميرا</p>
            <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
              يجب السماح بالوصول للكاميرا من إعدادات المتصفح لمسح الكود
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={start} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-white/15 text-white text-xs font-medium hover:bg-white/25 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
              إعادة المحاولة
            </button>
            <button type="button" onClick={onManual} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-brand-primary text-text-on-brand text-xs font-medium">
              <Keyboard className="w-3.5 h-3.5" strokeWidth={2} />
              إدخال يدوي
            </button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white text-center px-6">
          <div className="w-12 h-12 rounded-full bg-status-warning/20 flex items-center justify-center">
            <X className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-bold">تعذّر تشغيل الكاميرا</p>
            <p className="text-[11px] text-white/70 mt-1 leading-relaxed">{errorMsg || "حدث خطأ أثناء فتح الكاميرا"}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="button" onClick={start} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-white/15 text-white text-xs font-medium hover:bg-white/25 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
              إعادة المحاولة
            </button>
            <button type="button" onClick={onManual} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-sm bg-brand-primary text-text-on-brand text-xs font-medium">
              <Keyboard className="w-3.5 h-3.5" strokeWidth={2} />
              إدخال يدوي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
