"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg, formatBytes, toBlob } from "../lib/useFFmpeg";

type Status = "idle" | "loading" | "processing" | "done" | "error";

const FORMATS = [
  { label: "MP4 (H.264)", value: "mp4", mime: "video/mp4", args: ["-c:v", "libx264", "-c:a", "aac"] },
  { label: "WebM (VP9)", value: "webm", mime: "video/webm", args: ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "30", "-c:a", "libopus"] },
  { label: "AVI", value: "avi", mime: "video/x-msvideo", args: ["-c:v", "libx264", "-c:a", "aac"] },
  { label: "MOV", value: "mov", mime: "video/quicktime", args: ["-c:v", "libx264", "-c:a", "aac"] },
  { label: "MKV", value: "mkv", mime: "video/x-matroska", args: ["-c:v", "libx264", "-c:a", "aac"] },
];

export default function VideoConverter() {
  const { load } = useFFmpeg();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [targetFormat, setTargetFormat] = useState(FORMATS[0]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("video/")) { setInputFile(file); setOutputURL(null); setStatus("idle"); }
  };

  const convert = async () => {
    if (!inputFile) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await load(setProgress, setLog);
      setStatus("processing");

      const ext = inputFile.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      const outputName = `output.${targetFormat.value}`;

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
      await ffmpeg.exec(["-i", inputName, ...targetFormat.args, outputName]);

      const data = await ffmpeg.readFile(outputName);
      const blob = toBlob(data, targetFormat.mime);
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
        onClick={() => document.getElementById("conv-input")?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50"
      >
        <input id="conv-input" type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setInputFile(f); setOutputURL(null); setStatus("idle"); } }} />
        {inputFile ? (
          <div>
            <p className="font-semibold text-gray-900">{inputFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(inputFile.size)} · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">🔄</p>
            <p className="font-semibold text-gray-700">Drop video here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">Any common video format accepted</p>
          </div>
        )}
      </div>

      {inputFile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
          <p className="font-semibold text-gray-900 mb-4">Convert to</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {FORMATS.map((f) => (
              <button key={f.value} onClick={() => setTargetFormat(f)}
                className={`border rounded-xl p-3 text-left transition-all ${targetFormat.value === f.value ? "border-violet-500 bg-violet-50 text-violet-700 font-semibold" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <p className="text-sm">{f.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">.{f.value}</p>
              </button>
            ))}
          </div>

          <button onClick={convert} disabled={status === "loading" || status === "processing"}
            className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {status === "loading" ? "Loading FFmpeg..." : status === "processing" ? `Converting... ${progress}%` : `Convert to ${targetFormat.value.toUpperCase()}`}
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
          <p className="font-semibold text-green-800 mb-1">Conversion complete!</p>
          <p className="text-sm text-green-600 mb-4">Output: {formatBytes(outputSize)}</p>
          <video src={outputURL} controls className="w-full rounded-xl mb-4 max-h-64 bg-black" />
          <a href={outputURL} download={`converted.${targetFormat.value}`}
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Download {targetFormat.value.toUpperCase()} File
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Conversion failed. Some format combinations may not be supported — try MP4 as output.
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">🔒 Processed locally — never uploaded to any server.</p>
    </div>
  );
}
