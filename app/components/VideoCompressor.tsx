"use client";

import { useState, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const QUALITY_PRESETS = [
  { label: "Light (better quality)", value: "28", reduction: "~30–40%" },
  { label: "Medium (balanced)", value: "32", reduction: "~50–60%" },
  { label: "Heavy (smallest size)", value: "38", reduction: "~70–80%" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function VideoCompressor() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [crf, setCrf] = useState("32");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [inputSize, setInputSize] = useState(0);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));
    ffmpeg.on("log", ({ message }) => setLog(message));
    const stURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const canMultiThread = typeof SharedArrayBuffer !== "undefined";
    console.log("[FFmpeg/Compressor] SharedArrayBuffer available:", canMultiThread);
    if (canMultiThread) {
      try {
        console.log("[FFmpeg/Compressor] Attempting multi-threaded load from /ffmpeg-mt/");
        await ffmpeg.load({
          coreURL: "/ffmpeg-mt/ffmpeg-core.js",
          wasmURL: "/ffmpeg-mt/ffmpeg-core.wasm",
          workerURL: "/ffmpeg-mt/ffmpeg-core.worker.js",
        });
        console.log("[FFmpeg/Compressor] Multi-threaded load SUCCESS");
      } catch (err) {
        console.error("[FFmpeg/Compressor] Multi-threaded load FAILED:", err);
        console.log("[FFmpeg/Compressor] Falling back to single-threaded (CDN)");
        await ffmpeg.load({
          coreURL: await toBlobURL(`${stURL}/ffmpeg-core.js`, "text/javascript"),
          wasmURL: await toBlobURL(`${stURL}/ffmpeg-core.wasm`, "application/wasm"),
        });
        console.log("[FFmpeg/Compressor] Single-threaded fallback load SUCCESS");
      }
    } else {
      console.log("[FFmpeg/Compressor] SharedArrayBuffer unavailable — loading single-threaded (CDN)");
      console.log("[FFmpeg/Compressor] Fix: ensure COOP/COEP headers (Cross-Origin-Opener-Policy: same-origin, Cross-Origin-Embedder-Policy: require-corp)");
      await ffmpeg.load({
        coreURL: await toBlobURL(`${stURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${stURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      console.log("[FFmpeg/Compressor] Single-threaded load SUCCESS");
    }
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputFile(file);
    setInputSize(file.size);
    setOutputURL(null);
    setStatus("idle");
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("video/")) return;
    setInputFile(file);
    setInputSize(file.size);
    setOutputURL(null);
    setStatus("idle");
    setProgress(0);
  };

  const compress = async () => {
    if (!inputFile) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await loadFFmpeg();
      setStatus("processing");

      const ext = inputFile.name.split(".").pop()?.toLowerCase() || "mp4";
      const inputName = `input.${ext}`;
      const outputName = "output.mp4";

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
      await ffmpeg.exec([
        "-i", inputName,
        "-vcodec", "libx264",
        "-crf", crf,
        "-preset", "fast",
        "-acodec", "aac",
        "-b:a", "128k",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      // Copy out of SharedArrayBuffer into a plain ArrayBuffer for Blob compatibility
      const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: "video/mp4" });
      setOutputSize(blob.size);
      if (outputURL) URL.revokeObjectURL(outputURL);
      setOutputURL(URL.createObjectURL(blob));
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const savings = outputSize && inputSize ? Math.round((1 - outputSize / inputSize) * 100) : null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {inputFile ? (
          <div>
            <p className="font-semibold text-gray-900">{inputFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatBytes(inputSize)} · Click to change file
            </p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">🎬</p>
            <p className="font-semibold text-gray-700">
              Drop your video here or click to upload
            </p>
            <p className="text-sm text-gray-400 mt-1">
              MP4, MOV, AVI, WebM, MKV — up to 2GB
            </p>
          </div>
        )}
      </div>

      {/* Settings */}
      {inputFile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
          <p className="font-semibold text-gray-900 mb-4">Compression Level</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUALITY_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setCrf(preset.value)}
                className={`border rounded-xl p-3 text-left transition-all ${
                  crf === preset.value
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <p className="font-medium text-sm">{preset.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{preset.reduction} reduction</p>
              </button>
            ))}
          </div>

          <button
            onClick={compress}
            disabled={status === "loading" || status === "processing"}
            className="mt-6 w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading"
              ? "Loading FFmpeg..."
              : status === "processing"
              ? `Compressing... ${progress}%`
              : "Compress Video"}
          </button>
        </div>
      )}

      {/* Progress */}
      {(status === "loading" || status === "processing") && (
        <div className="mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-violet-500 rounded-full transition-all duration-300"
              style={{ width: `${status === "loading" ? 10 : progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 truncate">{log}</p>
        </div>
      )}

      {/* Result */}
      {status === "done" && outputURL && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-green-800">Compression complete!</p>
              <p className="text-sm text-green-600 mt-0.5">
                {formatBytes(inputSize)} → {formatBytes(outputSize)}
                {savings !== null && savings > 0 && (
                  <span className="ml-2 font-bold">(saved {savings}%)</span>
                )}
              </p>
            </div>
          </div>
          <video
            src={outputURL}
            controls
            className="w-full rounded-xl mb-4 max-h-64 bg-black"
          />
          <a
            href={outputURL}
            download="compressed_video.mp4"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            Download Compressed Video
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Something went wrong. Please try a different file or refresh the page.
        </div>
      )}

      {/* Privacy note */}
      <p className="text-center text-xs text-gray-400 mt-6">
        🔒 Your video is processed locally — it never leaves your device.
      </p>
    </div>
  );
}
