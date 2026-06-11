import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /node_modules[\\/]@ffmpeg[\\/]ffmpeg[\\/]dist[\\/]esm[\\/]worker\.js$/,
      loader: path.resolve("./loaders/ffmpeg-worker-patch.cjs"),
    });
    return config;
  },
};

export default nextConfig;
