"use client";

import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg, formatBytes, toBlob } from "../lib/useFFmpeg";

type Status = "idle" | "loading" | "processing" | "done" | "error";

export default function VideoTrimmer() {
  const { load } = useFFmpeg();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [startTime, setStartTime] = useState("0");
  const [endTime, setEndTime] = useState("30");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("video/")) { setInputFile(file); setOutputURL(null); setStatus("idle"); }
  };

  const trim = async () => {
    if (!inputFile) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await load(setProgress, setLog);
      setStatus("processing");

      const ext = inputFile.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      const duration = (parseFloat(endTime) - parseFloat(startTime)).toString();

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
      await ffmpeg.exec([
        "-ss", startTime,
        "-t", duration,
        "-i", inputName,
        "-c", "copy",
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

  const isValid = parseFloat(endTime) > parseFloat(startTime);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("trim-input")?.click()}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50"
      >
        <input id="trim-input" type="file" accept="video/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setInputFile(f); setOutputURL(null); setStatus("idle"); } }} />
        {inputFile ? (
          <div>
            <p className="font-semibold text-gray-900">{inputFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(inputFile.size)} · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-3">✂️</p>
            <p className="font-semibold text-gray-700">Drop video here or click to upload</p>
            <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI, WebM, MKV supported</p>
          </div>
        )}
      </div>

      {inputFile && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-6">
          <p className="font-semibold text-gray-900 mb-4">Set Trim Points (seconds)</p>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Start time</label>
              <input type="number" min="0" step="0.1" value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">End time</label>
              <input type="number" min="0" step="0.1" value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
            </div>
          </div>
          {!isValid && (
            <p className="text-xs text-red-500 mb-3">End time must be greater than start time.</p>
          )}
          <p className="text-xs text-gray-400 mb-4">
            Duration: {isValid ? `${(parseFloat(endTime) - parseFloat(startTime)).toFixed(1)}s` : "—"}
          </p>

          <button onClick={trim} disabled={!isValid || status === "loading" || status === "processing"}
            className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {status === "loading" ? "Loading FFmpeg..." : status === "processing" ? `Trimming... ${progress}%` : "Trim Video"}
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
          <p className="font-semibold text-green-800 mb-1">Trim complete!</p>
          <p className="text-sm text-green-600 mb-4">Output: {formatBytes(outputSize)}</p>
          <video src={outputURL} controls className="w-full rounded-xl mb-4 max-h-64 bg-black" />
          <a href={outputURL} download="trimmed_video.mp4"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Download Trimmed Video
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Something went wrong. Please check your time values and try again.
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">🔒 Processed locally — never uploaded to any server.</p>
    </div>
  );
}
