"use client";

import { useState, useCallback } from "react";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg, formatBytes, toBlob } from "../lib/useFFmpeg";

type Status = "idle" | "loading" | "processing" | "done" | "error";

export default function VideoMerger() {
  const { load } = useFFmpeg();
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const videos = Array.from(newFiles).filter((f) => f.type.startsWith("video/"));
    setFiles((prev) => [...prev, ...videos].slice(0, 6));
    setOutputURL(null);
    setStatus("idle");
  }, []);

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; });
  };

  const moveDown = (idx: number) => {
    setFiles((prev) => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a;
    });
  };

  const merge = async () => {
    if (files.length < 2) return;
    try {
      setStatus("loading");
      setProgress(0);
      const ffmpeg = await load(setProgress, setLog);
      setStatus("processing");

      const inputArgs: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const name = `input${i}.mp4`;
        await ffmpeg.writeFile(name, await fetchFile(files[i]));
        inputArgs.push("-i", name);
      }

      const filterInputs = files.map((_, i) => `[${i}:v][${i}:a]`).join("");
      const filterComplex = `${filterInputs}concat=n=${files.length}:v=1:a=1[outv][outa]`;

      await ffmpeg.exec([
        ...inputArgs,
        "-filter_complex", filterComplex,
        "-map", "[outv]",
        "-map", "[outa]",
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
      {/* File list */}
      {files.length > 0 && (
        <div className="mb-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(f.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveUp(i)} disabled={i === 0}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">▲</button>
                <button onClick={() => moveDown(i)} disabled={i === files.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">▼</button>
                <button onClick={() => removeFile(i)}
                  className="p-1 text-red-400 hover:text-red-600 ml-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("merge-input")?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center hover:border-violet-400 transition-colors cursor-pointer bg-gray-50 ${files.length >= 6 ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input id="merge-input" type="file" accept="video/*" multiple className="hidden"
          onChange={(e) => addFiles(e.target.files)} />
        <p className="text-3xl mb-2">🔗</p>
        <p className="font-semibold text-gray-700">
          {files.length === 0 ? "Drop videos here or click to upload" : "Add more videos (drag to reorder)"}
        </p>
        <p className="text-sm text-gray-400 mt-1">Up to 6 videos · Best results with same resolution</p>
      </div>

      {files.length >= 2 && (
        <button onClick={merge} disabled={status === "loading" || status === "processing"}
          className="mt-4 w-full bg-violet-600 text-white py-3 rounded-full font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
          {status === "loading" ? "Loading FFmpeg..." : status === "processing" ? `Merging... ${progress}%` : `Merge ${files.length} Videos`}
        </button>
      )}

      {files.length === 1 && (
        <p className="text-center text-sm text-gray-400 mt-4">Add at least one more video to merge.</p>
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
          <p className="font-semibold text-green-800 mb-1">Merge complete!</p>
          <p className="text-sm text-green-600 mb-4">{files.length} videos merged · {formatBytes(outputSize)}</p>
          <video src={outputURL} controls className="w-full rounded-xl mb-4 max-h-64 bg-black" />
          <a href={outputURL} download="merged_video.mp4"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
            Download Merged Video
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          Merge failed. For best results, use videos with the same resolution and frame rate.
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">🔒 Processed locally — never uploaded to any server.</p>
    </div>
  );
}
