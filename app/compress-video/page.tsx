import type { Metadata } from "next";
import Link from "next/link";
import VideoCompressor from "../components/VideoCompressor";
import { FaqSchema, ToolSchema, BreadcrumbSchema } from "../lib/seo";

export const metadata: Metadata = {
  title: "Free Video Compressor Online — No Upload Required",
  description:
    "Compress your video files for free, directly in your browser. Reduce MP4 size for WhatsApp, email, or web without losing quality. No uploads, 100% private.",
  keywords: [
    "online video compressor",
    "compress video online free",
    "reduce video file size",
    "compress mp4 online",
    "video compressor no upload",
    "reduce video size for whatsapp",
  ],
  alternates: { canonical: "https://videotools.app/compress-video" },
  openGraph: {
    title: "Free Video Compressor Online — No Upload Required",
    description:
      "Compress your video files directly in your browser. No uploads, no server, 100% private.",
    type: "website",
  },
};

const faq = [
  {
    q: "Does my video get uploaded to a server?",
    a: "No. All compression happens in your browser using FFmpeg.wasm (WebAssembly). Your video never leaves your device.",
  },
  {
    q: "What is the maximum file size?",
    a: "There is no server-imposed limit. The practical limit depends on your device's available RAM — typically 1–2GB.",
  },
  {
    q: "Will the video quality be affected?",
    a: "You control the quality level. 'Light' mode keeps high quality with ~30–40% size reduction. 'Heavy' mode gives maximum compression with some quality loss.",
  },
  {
    q: "What formats are supported?",
    a: "Input: MP4, MOV, AVI, WebM, MKV, FLV, and most other common video formats. Output is always MP4 (H.264), which is universally compatible.",
  },
  {
    q: "How do I compress a video for WhatsApp?",
    a: "Upload your video, select 'Medium' or 'Heavy' compression, click Compress, then download. WhatsApp has a 16MB limit — use Heavy mode for long videos.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, completely free. No account needed, no watermarks, no limits.",
  },
  {
    q: "How does the compression work?",
    a: "We use H.264 encoding with a configurable CRF (Constant Rate Factor) value. Lower CRF = better quality, higher CRF = smaller file. All via FFmpeg running in WebAssembly.",
  },
  {
    q: "Can I compress video on iPhone or Android?",
    a: "Yes. This tool works in any modern mobile browser including Safari on iOS and Chrome on Android.",
  },
];

const relatedTools = [
  { label: "Video Trimmer", href: "/trim-video" },
  { label: "Video to GIF", href: "/video-to-gif" },
  { label: "Remove Audio", href: "/remove-audio" },
  { label: "Video Converter", href: "/convert-video" },
];

export default function CompressVideoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Page Header */}
      <div className="py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">
            No Upload Required
          </span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            100% Free
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Free Online Video Compressor
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-base">
          Reduce your video file size without losing quality. Works entirely in
          your browser — no uploads, no accounts.
        </p>
      </div>

      {/* How it works */}
      <div className="flex justify-center gap-8 mb-10 text-center text-sm text-gray-500">
        {[
          { step: "1", label: "Upload your video" },
          { step: "2", label: "Choose compression level" },
          { step: "3", label: "Download compressed file" },
        ].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {step}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Tool */}
      <VideoCompressor />

      <ToolSchema name="Free Online Video Compressor" description="Free online video compressor that runs in your browser. No file uploads required." />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://videotools.app/" }, { name: "Video Compressor", url: "https://videotools.app/compress-video" }]} />

      {/* FAQ */}
      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faq.map(({ q, a }) => (
            <div key={q} className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mt-16 mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">
          More Free Video Tools
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {relatedTools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-violet-400 hover:text-violet-600 transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      <FaqSchema items={faq} />
    </div>
  );
}
