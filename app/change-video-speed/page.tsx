import type { Metadata } from "next";
import Link from "next/link";
import SpeedChanger from "../components/SpeedChanger";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free Video Speed Changer Online — Slow Motion & Fast Forward",
  description:
    "Speed up or slow down any video for free in your browser. Supports 0.25× to 4× speed. Slow motion, timelapse, and fast forward — no uploads.",
  keywords: ["video speed changer", "slow motion video online", "speed up video online free", "change video speed", "timelapse video maker"],
  alternates: { canonical: "https://videotools.app/change-video-speed" },
  openGraph: {
    title: "Free Video Speed Changer — Slow Motion & Fast Forward",
    description: "Change video speed from 0.25× to 4× in your browser. No uploads required.",
    type: "website",
  },
};

const faq = [
  { q: "What speed options are available?", a: "0.25×, 0.5×, 0.75×, 1.25×, 1.5×, 2×, and 4×. Both the video and audio are adjusted to match." },
  { q: "Does the audio pitch change with speed?", a: "No. The tool uses the atempo filter which adjusts audio speed while preserving pitch. Your audio won't sound chipmunk or distorted." },
  { q: "How do I make a slow motion video?", a: "Upload your video and select 0.25× or 0.5×. The video will play at half or quarter speed." },
  { q: "How do I make a timelapse?", a: "Select 2× or 4× to fast forward. 4× makes a 1-minute video play in 15 seconds." },
  { q: "Is my file uploaded anywhere?", a: "No. Processing happens entirely in your browser using FFmpeg.wasm." },
];

export default function ChangeVideoSpeedPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">0.25× to 4×</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Free Video Speed Changer</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Slow motion, fast forward, timelapse — change video speed without distorting audio pitch.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload your video" }, { step: "2", label: "Select speed" }, { step: "3", label: "Download video" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <SpeedChanger />
      <ToolSchema name="Free Video Speed Changer" description="Free Video Speed Changer — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://videotools.app/" }, { name: "Free Video Speed Changer", url: "https://videotools.app/change-video-speed" }]} />

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
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video Trimmer", href: "/trim-video" }, { label: "Video to GIF", href: "/video-to-gif" }, { label: "Merge Videos", href: "/merge-videos" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
