import type { Metadata } from "next";
import Link from "next/link";
import VideoMerger from "../components/VideoMerger";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free Online Video Merger — Join Multiple Videos No Upload",
  description:
    "Merge and combine multiple video clips into one file for free, directly in your browser. Supports up to 6 videos. No uploads, no account.",
  keywords: ["merge videos online free", "join videos online", "combine video clips", "video joiner no upload", "merge mp4 files online"],
  alternates: { canonical: "https://zipvid.online/merge-videos" },
  openGraph: {
    title: "Free Online Video Merger — Join Multiple Videos",
    description: "Combine multiple video clips into one in your browser. No uploads required.",
    type: "website",
  },
};

const faq = [
  { q: "How many videos can I merge?", a: "Up to 6 videos at once." },
  { q: "Do the videos need to be the same format?", a: "No, but for best results use videos with the same resolution and frame rate. Different resolutions may cause issues." },
  { q: "Can I reorder the videos before merging?", a: "Yes — use the up/down arrows next to each video in the list to reorder them before merging." },
  { q: "Will there be quality loss?", a: "The tool re-encodes to H.264 to ensure compatibility across all clips. This may cause a small quality reduction." },
  { q: "Is my video uploaded to a server?", a: "No. All processing is done locally in your browser using FFmpeg.wasm." },
  { q: "What is the output format?", a: "MP4 (H.264/AAC) — the most universally compatible format." },
];

export default function MergeVideosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">Up to 6 Videos</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Free Online Video Merger</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Combine multiple video clips into one seamless video — no uploads, no account needed.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload videos" }, { step: "2", label: "Arrange order" }, { step: "3", label: "Download merged video" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <VideoMerger />
      <ToolSchema name="Free Online Video Merger" description="Free Online Video Merger — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://zipvid.online/" }, { name: "Free Online Video Merger", url: "https://zipvid.online/merge-videos" }]} />

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
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video Trimmer", href: "/trim-video" }, { label: "Add Watermark", href: "/add-watermark" }, { label: "Speed Changer", href: "/change-video-speed" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
