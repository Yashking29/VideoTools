"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg, formatBytes, toBlob } from "../lib/useFFmpeg";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const POSITIONS = [
  { label: "Top Left", value: "10:10" },
  { label: "Top Right", value: "w-tw-10:10" },
  { label: "Center", value: "(w-tw)/2:(h-th)/2" },
  { label: "Bottom Left", value: "10:h-th-10" },
  { label: "Bottom Right", value: "w-tw-10:h-th-10" },
];

const FONT_SIZES = ["20", "32", "48", "64"];

export default function WatermarkAdder() {
  const { load } = useFFmpeg();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [text, setText] = useState("© My Brand");
  const [position, setPosition] = useState(POSITIONS[4]);
  const [fontSize, setFontSize] = useState("32");
  const [opacity, setOpacity] = useState("0.7");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("video/")) { setInputFile(file); setOutputURL(null); setStatus("idle"); }
  };

  const addWatermark = async () => {
    if (!inputFile || !text.trim()) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await load(setProgress, setLog);
      setStatus("processing");

      const ext = inputFile.name.split(".").pop() || "mp4";
      await ffmpeg.writeFile(`input.${ext}`, await fetchFile(inputFile));

      const drawtext = `drawtext=text='${text.replace(/'/g, "\\'")}':x=${position.value}:y=${position.value.split(":")[1]}:fontsize=${fontSize}:fontcolor=white@${opacity}:shadowcolor=black@0.5:shadowx=2:shadowy=2`;

      await ffmpeg.exec([
        "-i", `input.${ext}`,
        "-vf", drawtext,
        "-c:v", "libx264",
        "-c:a", "copy",
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
        onClick={() => document.getElementById("wm-input")?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50"
      >
        <input id="wm-input" type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setInputFile(f); setOutputURL(null); setStatus("idle"); } }} />
        {inputFile ? (
          <div>
            <p className="font-semibold text-gray-900">{inputFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(inputFile.size)} · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">🏷️</p>
            <p className="font-semibold text-gray-700">Drop video here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI, WebM, MKV supported</p>
          </div>
        )}
      </div>

      {inputFile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Watermark Text</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={60}
              placeholder="Your text here"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Position</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {POSITIONS.map((p) => (
                <button key={p.value} onClick={() => setPosition(p)}
                  className={`border rounded-xl py-2 text-xs transition-all ${position.value === p.value ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Font Size</p>
              <div className="grid grid-cols-4 gap-1">
                {FONT_SIZES.map((s) => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className={`border rounded-lg py-1.5 text-xs transition-all ${fontSize === s ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600"}`}>
                    {s}px
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Opacity ({Math.round(parseFloat(opacity) * 100)}%)</label>
              <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)}
                className="w-full accent-violet-600" />
            </div>
          </div>

          <button onClick={addWatermark} disabled={!text.trim() || status === "loading" || status === "processing"}
            className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {status === "loading" ? "Loading FFmpeg..." : status === "processing" ? `Adding watermark... ${progress}%` : "Add Watermark"}
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
          <p className="font-semibold text-green-800 mb-4">Watermark added!</p>
          <video src={outputURL} controls className="w-full rounded-xl mb-4 max-h-64 bg-black" />
          <a href={outputURL} download="watermarked_video.mp4"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Download Watermarked Video
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Something went wrong. Avoid special characters in the watermark text.
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">🔒 Processed locally — never uploaded to any server.</p>
    </div>
  );
}
