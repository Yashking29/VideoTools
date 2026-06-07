import type { Metadata } from "next";
import Link from "next/link";
import VideoTrimmer from "../components/VideoTrimmer";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free Online Video Trimmer — Cut Video Without Re-encoding",
  description:
    "Trim and cut any video online for free. Set start and end points, download instantly. No upload required — runs entirely in your browser.",
  keywords: ["video trimmer online", "cut video online free", "trim mp4 online", "video cutter no upload", "online video cutter"],
  alternates: { canonical: "https://zipvid.online/trim-video" },
  openGraph: {
    title: "Free Online Video Trimmer — No Upload Required",
    description: "Cut and trim any video in your browser. No uploads, instant download.",
    type: "website",
  },
};

const faq = [
  { q: "Will trimming affect video quality?", a: "No. This tool uses stream copy (-c copy) which cuts the video without re-encoding, so there is zero quality loss." },
  { q: "How precise is the trim?", a: "Trimming is accurate to 0.1 seconds. For frame-perfect cuts, the keyframe alignment may vary slightly." },
  { q: "What formats can I trim?", a: "Upload MP4, MOV, AVI, WebM, or MKV. Output is always MP4 for maximum compatibility." },
  { q: "Is there a maximum video length?", a: "No. You can trim videos of any length — the limiting factor is your device's available RAM." },
  { q: "Is my file uploaded anywhere?", a: "No. Everything runs locally in your browser using FFmpeg.wasm. Your file is never sent to any server." },
];

export default function TrimVideoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">No Re-encoding</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Free Online Video Trimmer</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Cut your video to exactly the length you need. Zero quality loss, no uploads.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload your video" }, { step: "2", label: "Set start & end time" }, { step: "3", label: "Download trimmed clip" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <VideoTrimmer />
      <ToolSchema name="Free Online Video Trimmer" description="Free Online Video Trimmer — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://zipvid.online/" }, { name: "Free Online Video Trimmer", url: "https://zipvid.online/trim-video" }]} />

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
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video to GIF", href: "/video-to-gif" }, { label: "Remove Audio", href: "/remove-audio" }, { label: "Speed Changer", href: "/change-video-speed" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
