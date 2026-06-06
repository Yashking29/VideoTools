import Link from "next/link";

const tools = [
  { label: "Compressor", href: "/compress-video" },
  { label: "Trimmer", href: "/trim-video" },
  { label: "To GIF", href: "/video-to-gif" },
  { label: "Remove Audio", href: "/remove-audio" },
  { label: "Converter", href: "/convert-video" },
];

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-violet-600 tracking-tight">
          VideoTools
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
