"use client";

import { useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const ST_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export function useFFmpeg() {
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const load = useCallback(
    async (
      onProgress: (p: number) => void,
      onLog: (msg: string) => void
    ): Promise<FFmpeg> => {
      if (ffmpegRef.current) return ffmpegRef.current;
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress }) => onProgress(Math.round(progress * 100)));
      ffmpeg.on("log", ({ message }) => onLog(message));
      const canMultiThread = typeof SharedArrayBuffer !== "undefined";
      console.log("[FFmpeg] SharedArrayBuffer available:", canMultiThread);
      if (canMultiThread) {
        try {
          console.log("[FFmpeg] Attempting multi-threaded load from /ffmpeg-mt/");
          await ffmpeg.load({
            coreURL: "/ffmpeg-mt/ffmpeg-core.js",
            wasmURL: "/ffmpeg-mt/ffmpeg-core.wasm",
            workerURL: "/ffmpeg-mt/ffmpeg-core.worker.js",
          });
          console.log("[FFmpeg] Multi-threaded load SUCCESS");
        } catch (err) {
          console.error("[FFmpeg] Multi-threaded load FAILED:", err);
          console.log("[FFmpeg] Falling back to single-threaded (CDN)");
          await ffmpeg.load({
            coreURL: await toBlobURL(`${ST_BASE}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${ST_BASE}/ffmpeg-core.wasm`, "application/wasm"),
          });
          console.log("[FFmpeg] Single-threaded fallback load SUCCESS");
        }
      } else {
        console.log("[FFmpeg] SharedArrayBuffer unavailable — loading single-threaded (CDN)");
        console.log("[FFmpeg] Fix: ensure COOP/COEP headers are set (Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Embedder-Policy: require-corp)");
        await ffmpeg.load({
          coreURL: await toBlobURL(`${ST_BASE}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${ST_BASE}/ffmpeg-core.wasm`, "application/wasm"),
        });
        console.log("[FFmpeg] Single-threaded load SUCCESS");
      }
      ffmpegRef.current = ffmpeg;
      return ffmpeg;
    },
    []
  );

  return { load };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function toBlob(data: unknown, mime: string): Blob {
  return new Blob([new Uint8Array(data as Uint8Array)], { type: mime });
}
