import type { Metadata } from "next";
import Link from "next/link";
import { FaqSchema } from "./lib/seo";

export const metadata: Metadata = {
  title: "Free Online Video Tools — No Upload Required",
  description:
    "Compress, trim, convert, and edit videos for free. All tools run 100% in your browser — your files never leave your device.",
  alternates: { canonical: "https://zipvid.online/" },
};

const tools = [
  {
    title: "Video Compressor",
    description: "Reduce video file size without losing quality. Perfect for WhatsApp, email, and web.",
    href: "/compress-video",
    icon: "⚡",
    badge: "Most Popular",
  },
  {
    title: "Video to GIF",
    description: "Convert any video clip to an animated GIF instantly.",
    href: "/video-to-gif",
    icon: "🎞️",
  },
  {
    title: "Video Trimmer",
    description: "Cut and trim your video to the exact length you need.",
    href: "/trim-video",
    icon: "✂️",
  },
  {
    title: "Remove Audio",
    description: "Strip the audio track from any video file in seconds.",
    href: "/remove-audio",
    icon: "🔇",
  },
  {
    title: "Video Converter",
    description: "Convert between MP4, WebM, MOV, AVI, and more formats.",
    href: "/convert-video",
    icon: "🔄",
  },
  {
    title: "Speed Changer",
    description: "Speed up or slow down your video — 0.25x to 4x.",
    href: "/change-video-speed",
    icon: "⏩",
  },
  {
    title: "Add Watermark",
    description: "Overlay text or image watermarks on your video.",
    href: "/add-watermark",
    icon: "🏷️",
  },
  {
    title: "Merge Videos",
    description: "Join multiple video clips into a single file.",
    href: "/merge-videos",
    icon: "🔗",
  },
];

const features = [
  {
    title: "Your files never leave your device",
    description:
      "All processing happens locally in your browser using WebAssembly. No uploads, no servers, no privacy risks.",
  },
  {
    title: "Completely free, no account needed",
    description:
      "Every tool is free to use. No sign-up, no watermarks, no file limits on what you can process.",
  },
  {
    title: "Works on any file size",
    description:
      "Process videos up to 2GB depending on your device. No artificial limits imposed by server costs.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-50 to-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            100% Free · No Upload Required
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Free Online Video Tools
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Compress, trim, convert, and edit videos directly in your browser.
            Your files never leave your device.
          </p>
          <Link
            href="/compress-video"
            className="inline-block bg-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-violet-700 transition-colors text-sm"
          >
            Start with Video Compressor →
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          All Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative border border-gray-200 rounded-xl p-5 hover:border-violet-400 hover:shadow-md transition-all bg-white"
            >
              {tool.badge && (
                <span className="absolute top-3 right-3 bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {tool.badge}
                </span>
              )}
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Features */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Why VideoTools?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Are these tools really free?",
              a: "Yes, 100% free. No sign-up, no payment, no hidden costs.",
            },
            {
              q: "Do my videos get uploaded to a server?",
              a: "No. All processing happens in your browser using WebAssembly (FFmpeg.wasm). Your files never leave your device.",
            },
            {
              q: "What video formats are supported?",
              a: "Most common formats: MP4, MOV, AVI, WebM, MKV, FLV, and more.",
            },
            {
              q: "Is there a file size limit?",
              a: "No server-imposed limit. The practical limit depends on your device's RAM — typically 1–2GB.",
            },
            {
              q: "Will my video quality be affected?",
              a: "You have full control over quality settings. Our defaults are optimized to reduce size while keeping good visual quality.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WebSite schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "VideoTools",
            url: "https://zipvid.online",
            description: "Free online video tools — compress, trim, convert, and edit videos in your browser.",
          }),
        }}
      />

      <FaqSchema
        items={[
          { q: "Are these tools really free?", a: "Yes, 100% free. No sign-up, no payment, no hidden costs." },
          { q: "Do my videos get uploaded to a server?", a: "No. All processing happens in your browser using WebAssembly (FFmpeg.wasm). Your files never leave your device." },
          { q: "What video formats are supported?", a: "Most common formats: MP4, MOV, AVI, WebM, MKV, FLV, and more." },
          { q: "Is there a file size limit?", a: "No server-imposed limit. The practical limit depends on your device's RAM — typically 1–2GB." },
          { q: "Will my video quality be affected?", a: "You have full control over quality settings. Our defaults are optimized to reduce size while keeping good visual quality." },
        ]}
      />
    </>
  );
}
