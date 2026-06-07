import type { MetadataRoute } from "next";

const BASE_URL = "https://zipvid.online";

const routes = [
  { path: "/", priority: 1.0 },
  { path: "/compress-video", priority: 0.9 },
  { path: "/video-to-gif", priority: 0.9 },
  { path: "/trim-video", priority: 0.9 },
  { path: "/remove-audio", priority: 0.8 },
  { path: "/convert-video", priority: 0.8 },
  { path: "/change-video-speed", priority: 0.7 },
  { path: "/add-watermark", priority: 0.7 },
  { path: "/merge-videos", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
