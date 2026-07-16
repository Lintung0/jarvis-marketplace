import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Modesy - Marketplace Terpercaya",
    short_name: "Modesy",
    description: "Marketplace untuk produk digital, fisik, dan lisensi dari vendor pilihan",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00a99d",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
