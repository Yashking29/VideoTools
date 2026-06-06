import type { Metadata } from "next";
import Link from "next/link";
import VideoConverter from "../components/VideoConverter";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free Online Video Converter — MP4, WebM, AVI, MOV, MKV",
  description:
    "Convert video between MP4, WebM, AVI, MOV, and MKV formats for free, directly in your browser. No uploads, no account required.",
  keywords: ["online video converter", "convert mp4 to webm", "video format converter free", "convert video online no upload", "mp4 converter"],
  alternates: { canonical: "https://videotools.app/convert-video" },
  openGraph: {
    title: "Free Online Video Converter — MP4, WebM, AVI, MOV, MKV",
    description: "Convert any video format in your browser. No uploads, 100% private.",
    type: "website",
  },
};

const faq = [
  { q: "Which formats are supported?", a: "Input: MP4, MOV, AVI, WebM, MKV, FLV, and more. Output: MP4, WebM, AVI, MOV, MKV." },
  { q: "Which format should I use?", a: "MP4 (H.264) is the most compatible — works on all devices and platforms. WebM is best for the web. MOV is ideal for Apple devices." },
  { q: "Will conversion affect quality?", a: "Conversion always re-encodes the video, which causes a small quality reduction. We use high-quality defaults to minimize this." },
  { q: "Why convert to WebM?", a: "WebM files are significantly smaller than MP4 and are natively supported by Chrome and Firefox, making them ideal for web pages." },
  { q: "Is my file uploaded to a server?", a: "No. All conversion happens locally in your browser using FFmpeg.wasm. Your files stay on your device." },
];

export default function ConvertVideoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">5 Output Formats</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Free Online Video Format Converter</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Convert between MP4, WebM, AVI, MOV, and MKV — no uploads, no account needed.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload your video" }, { step: "2", label: "Choose output format" }, { step: "3", label: "Download converted file" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <VideoConverter />
      <ToolSchema name="Free Online Video Converter" description="Free Online Video Converter — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://videotools.app/" }, { name: "Free Online Video Converter", url: "https://videotools.app/convert-video" }]} />

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
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video Trimmer", href: "/trim-video" }, { label: "Video to GIF", href: "/video-to-gif" }, { label: "Speed Changer", href: "/change-video-speed" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
