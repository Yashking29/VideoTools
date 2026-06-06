"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg, formatBytes, toBlob } from "../lib/useFFmpeg";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const FPS_OPTIONS = [
  { label: "10 fps — smallest file", value: "10" },
  { label: "15 fps — balanced", value: "15" },
  { label: "24 fps — smooth", value: "24" },
];

const WIDTH_OPTIONS = [
  { label: "320px — tiny", value: "320" },
  { label: "480px — medium", value: "480" },
  { label: "640px — large", value: "640" },
];

export default function VideoToGif() {
  const { load } = useFFmpeg();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [fps, setFps] = useState("15");
  const [width, setWidth] = useState("480");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("5");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("video/")) {
      setInputFile(file);
      setOutputURL(null);
      setStatus("idle");
    }
  };

  const convert = async () => {
    if (!inputFile) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await load(setProgress, setLog);
      setStatus("processing");

      await ffmpeg.writeFile("input.mp4", await fetchFile(inputFile));
      await ffmpeg.exec([
        "-ss", startTime,
        "-t", duration,
        "-i", "input.mp4",
        "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        "-loop", "0",
        "output.gif",
      ]);

      const data = await ffmpeg.readFile("output.gif");
      const blob = toBlob(data, "image/gif");
      setOutputSize(blob.size);
      if (outputURL) URL.revokeObjectURL(outputURL);
      setOutputURL(URL.createObjectURL(blob));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("gif-input")?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50"
      >
        <input id="gif-input" type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setInputFile(f); setOutputURL(null); setStatus("idle"); } }} />
        {inputFile ? (
          <div>
            <p className="font-semibold text-gray-900">{inputFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(inputFile.size)} · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">🎞️</p>
            <p className="font-semibold text-gray-700">Drop video here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI, WebM supported</p>
          </div>
        )}
      </div>

      {inputFile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Start time (seconds)</label>
              <input type="number" min="0" value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Duration (seconds)</label>
              <input type="number" min="1" max="30" value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Frame Rate</p>
            <div className="grid grid-cols-3 gap-2">
              {FPS_OPTIONS.map((o) => (
                <button key={o.value} onClick={() => setFps(o.value)}
                  className={`border rounded-xl p-2.5 text-xs transition-all ${fps === o.value ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Output Width</p>
            <div className="grid grid-cols-3 gap-2">
              {WIDTH_OPTIONS.map((o) => (
                <button key={o.value} onClick={() => setWidth(o.value)}
                  className={`border rounded-xl p-2.5 text-xs transition-all ${width === o.value ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={convert} disabled={status === "loading" || status === "processing"}
            className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {status === "loading" ? "Loading FFmpeg..." : status === "processing" ? `Converting... ${progress}%` : "Convert to GIF"}
          </button>
        </div>
      )}

      {(status === "loading" || status === "processing") && (
        <div className="mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2 bg-violet-500 rounded-full transition-all" style={{ width: `${status === "loading" ? 10 : progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2 truncate">{log}</p>
        </div>
      )}

      {status === "done" && outputURL && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="font-semibold text-green-800 mb-1">GIF ready!</p>
          <p className="text-sm text-green-600 mb-4">Size: {formatBytes(outputSize)}</p>
          <img src={outputURL} alt="Output GIF" className="w-full rounded-xl mb-4 max-h-64 object-contain bg-gray-100" />
          <a href={outputURL} download="output.gif"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Download GIF
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Something went wrong. Try a shorter clip or smaller video.
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">🔒 Processed locally — never uploaded to any server.</p>
    </div>
  );
}
