"use client";

import { useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

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
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      });
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
