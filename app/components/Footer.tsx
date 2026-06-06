import Link from "next/link";

const tools = [
  { label: "Video Compressor", href: "/compress-video" },
  { label: "Video Trimmer", href: "/trim-video" },
  { label: "Video to GIF", href: "/video-to-gif" },
  { label: "Remove Audio", href: "/remove-audio" },
  { label: "Video Converter", href: "/convert-video" },
  { label: "Speed Changer", href: "/change-video-speed" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-violet-600 text-lg mb-2">VideoTools</p>
          <p className="text-sm text-gray-500">
            Free online video tools that run 100% in your browser. No uploads,
            no accounts, no limits.
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-3 text-sm">Tools</p>
          <ul className="space-y-2">
            {tools.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-3 text-sm">Why VideoTools?</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>✓ No file uploads — 100% private</li>
            <li>✓ Works offline after first load</li>
            <li>✓ No account required</li>
            <li>✓ Powered by FFmpeg.wasm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} VideoTools. All rights reserved.
      </div>
    </footer>
  );
}
