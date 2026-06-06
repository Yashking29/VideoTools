import type { Metadata } from "next";
import Link from "next/link";
import AudioRemover from "../components/AudioRemover";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Remove Audio from Video Online Free — No Upload Required",
  description:
    "Strip audio from any video in seconds. Mute your video file for free directly in your browser. No upload, no account, instant download.",
  keywords: ["remove audio from video", "mute video online", "strip audio from mp4", "remove sound from video free", "silent video maker"],
  alternates: { canonical: "https://videotools.app/remove-audio" },
  openGraph: {
    title: "Remove Audio from Video Online Free",
    description: "Mute any video instantly in your browser. No uploads, 100% private.",
    type: "website",
  },
};

const faq = [
  { q: "Will removing audio affect video quality?", a: "No. The tool uses stream copy for video, meaning the video track is not re-encoded. Quality is 100% preserved." },
  { q: "Why would I want to remove audio?", a: "Common use cases: removing background noise, music with copyright, preparing a video for a new voiceover, or sharing clips where the original audio is private." },
  { q: "Can I add new audio after removing it?", a: "Yes — use any video editor to add your own music or voiceover after downloading the silent video." },
  { q: "Is the process instant?", a: "Nearly instant. Since video is not re-encoded, processing is very fast regardless of file size." },
  { q: "Is my video uploaded to a server?", a: "No. Everything runs locally in your browser using FFmpeg.wasm." },
];

export default function RemoveAudioPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">Instant Processing</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Remove Audio from Video Online</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Mute your video in one click. No quality loss, no uploads, no waiting.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload your video" }, { step: "2", label: "Click Remove Audio" }, { step: "3", label: "Download silent video" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <AudioRemover />
      <ToolSchema name="Remove Audio from Video Online" description="Remove Audio from Video Online — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://videotools.app/" }, { name: "Remove Audio from Video Online", url: "https://videotools.app/remove-audio" }]} />

      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faq.map(({ q, a }) => (
            <div key={q} className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">More Free Video Tools</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video Trimmer", href: "/trim-video" }, { label: "Add Watermark", href: "/add-watermark" }, { label: "Merge Videos", href: "/merge-videos" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
