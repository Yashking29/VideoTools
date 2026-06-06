import type { Metadata } from "next";
import Link from "next/link";
import WatermarkAdder from "../components/WatermarkAdder";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Add Watermark to Video Online Free — Text Watermark No Upload",
  description:
    "Add a custom text watermark to any video for free in your browser. Choose position, size, and opacity. No uploads, no account required.",
  keywords: ["add watermark to video", "video watermark online free", "text watermark video", "watermark video no upload", "brand video online"],
  alternates: { canonical: "https://videotools.app/add-watermark" },
  openGraph: {
    title: "Add Watermark to Video Online Free",
    description: "Add text watermarks to videos in your browser. No uploads required.",
    type: "website",
  },
};

const faq = [
  { q: "What types of watermarks can I add?", a: "Currently text watermarks. You can customize the text, position, font size, and opacity." },
  { q: "Will the watermark be permanent?", a: "Yes — the watermark is burned into the video. Make sure to keep your original file if you need a non-watermarked version." },
  { q: "Can I control the transparency?", a: "Yes. The opacity slider lets you set transparency from 10% to 100%." },
  { q: "What positions are available?", a: "Top Left, Top Right, Center, Bottom Left, and Bottom Right." },
  { q: "Is my video uploaded to a server?", a: "No. Processing is done entirely in your browser using FFmpeg.wasm. Your video never leaves your device." },
];

export default function AddWatermarkPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">Custom Text</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">100% Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Add Watermark to Video Online</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Protect and brand your videos with a custom text watermark. No uploads, instant download.</p>
      </div>

      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[{ step: "1", label: "Upload your video" }, { step: "2", label: "Customize watermark" }, { step: "3", label: "Download branded video" }].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <WatermarkAdder />
      <ToolSchema name="Add Watermark to Video Online" description="Add Watermark to Video Online — runs 100% in your browser, no upload required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://videotools.app/" }, { name: "Add Watermark to Video Online", url: "https://videotools.app/add-watermark" }]} />

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
          {[{ label: "Video Compressor", href: "/compress-video" }, { label: "Video Trimmer", href: "/trim-video" }, { label: "Remove Audio", href: "/remove-audio" }, { label: "Merge Videos", href: "/merge-videos" }].map((t) => (
            <Link key={t.href} href={t.href} className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors">{t.label}</Link>
          ))}
        </div>
      </section>
      <FaqSchema items={faq} />
    </div>
  );
}
