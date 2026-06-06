"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg, formatBytes, toBlob } from "../lib/useFFmpeg";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const SPEEDS = [
  { label: "0.25×", value: 0.25, pts: "4", atempo: ["0.5", "0.5"] },
  { label: "0.5×", value: 0.5, pts: "2", atempo: ["0.5"] },
  { label: "0.75×", value: 0.75, pts: "1.333", atempo: ["0.75"] },
  { label: "1.25×", value: 1.25, pts: "0.8", atempo: ["1.25"] },
  { label: "1.5×", value: 1.5, pts: "0.667", atempo: ["1.5"] },
  { label: "2×", value: 2, pts: "0.5", atempo: ["2.0"] },
  { label: "4×", value: 4, pts: "0.25", atempo: ["2.0", "2.0"] },
];

export default function SpeedChanger() {
  const { load } = useFFmpeg();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [speed, setSpeed] = useState(SPEEDS[5]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("video/")) { setInputFile(file); setOutputURL(null); setStatus("idle"); }
  };

  const changeSpeed = async () => {
    if (!inputFile) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await load(setProgress, setLog);
      setStatus("processing");

      const ext = inputFile.name.split(".").pop() || "mp4";
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(inputFile));

      const atempoFilter = speed.atempo.map((v) => `atempo=${v}`).join(",");
      await ffmpeg.exec([
        "-i", `input.${ext}`,
        "-filter_complex", `[0:v]setpts=${speed.pts}*PTS[v];[0:a]${atempoFilter}[a]`,
        "-map", "[v]",
        "-map", "[a]",
        "-c:v", "libx264",
        "-c:a", "aac",
        "output.mp4",
      ]);

      const data = await ffmpeg.readFile("output.mp4");
      const blob = toBlob(data, "video/mp4");
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
        onClick={() => document.getElementById("speed-input")?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50"
      >
        <input id="speed-input" type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setInputFile(f); setOutputURL(null); setStatus("idle"); } }} />
        {inputFile ? (
          <div>
            <p className="font-semibold text-gray-900">{inputFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(inputFile.size)} · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">⏩</p>
            <p className="font-semibold text-gray-700">Drop video here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI, WebM, MKV supported</p>
          </div>
        )}
      </div>

      {inputFile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
          <p className="font-semibold text-gray-900 mb-4">Select Speed</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
            {SPEEDS.map((s) => (
              <button key={s.value} onClick={() => setSpeed(s)}
                className={`border rounded-xl py-3 text-sm font-semibold transition-all ${speed.value === s.value ? "border-violet-500 bg-violet-600 text-white" : "border-gray-200 text-gray-700 hover:border-violet-300"}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl mb-6 text-sm text-amber-700">
            <span>⚡</span>
            <span>
              {speed.value < 1 ? "Slow motion — video will be longer" : speed.value > 1 ? "Fast forward — video will be shorter" : "Normal speed"}
              {speed.value >= 2 && " · Audio pitch is preserved"}
            </span>
          </div>

          <button onClick={changeSpeed} disabled={status === "loading" || status === "processing"}
            className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {status === "loading" ? "Loading FFmpeg..." : status === "processing" ? `Processing... ${progress}%` : `Apply ${speed.label} Speed`}
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
          <p className="font-semibold text-green-800 mb-1">Speed changed to {speed.label}!</p>
          <p className="text-sm text-green-600 mb-4">Output: {formatBytes(outputSize)}</p>
          <video src={outputURL} controls className="w-full rounded-xl mb-4 max-h-64 bg-black" />
          <a href={outputURL} download="speed_changed.mp4"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Download Video
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Something went wrong. Try a different file or speed setting.
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">🔒 Processed locally — never uploaded to any server.</p>
    </div>
  );
}
