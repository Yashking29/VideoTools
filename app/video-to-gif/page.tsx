import type { Metadata } from "next";
import Link from "next/link";
import VideoToGif from "../components/VideoToGif";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free Video to GIF Converter Online — No Upload Required",
  description:
    "Convert any video to an animated GIF for free, directly in your browser. Choose frame rate, size, and clip duration. No uploads, 100% private.",
  keywords: ["video to gif", "convert video to gif online", "mp4 to gif", "free gif maker", "video to gif no upload"],
  alternates: { canonical: "https://zipvid.online/video-to-gif" },
  openGraph: {
    title: "Free Video to GIF Converter Online",
    description: "Convert video to GIF in your browser. No uploads, instant download.",
    type: "website",
  },
};

const faq = [
  { q: "How do I convert a video to GIF?", a: "Upload your video, set the start time and duration (keep it under 10s for best results), choose frame rate and width, then click Convert." },
  { q: "Why is my GIF file so large?", a: "GIFs are uncompressed. Lower the frame rate to 10fps and width to 320px to reduce size significantly." },
  { q: "What's the best clip duration for a GIF?", a: "2–8 seconds produces the best results. Longer clips create very large files." },
  { q: "Will the GIF loop automatically?", a: "Yes — all GIFs created by this tool loop infinitely." },
  { q: "Is my video uploaded anywhere?", a: "No. All conversion happens in your browser using FFmpeg.wasm. Your video never leaves your device." },
];

export default function VideoToGifPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">No Upload Required</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Free Video to GIF Converter</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Convert any video clip to an animated GIF instantly — no uploads, no accounts needed.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload your video" }, { step: "2", label: "Set clip & quality" }, { step: "3", label: "Download GIF" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <VideoToGif />
      <ToolSchema name="Free Video to GIF Converter" description="Free Video to GIF Converter — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://zipvid.online/" }, { name: "Free Video to GIF Converter", url: "https://zipvid.online/video-to-gif" }]} />

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
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video Trimmer", href: "/trim-video" }, { label: "Remove Audio", href: "/remove-audio" }, { label: "Video Converter", href: "/convert-video" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
