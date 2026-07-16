import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import RegisterSW from "@/components/pwa/RegisterSW";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: "Modesy - Marketplace Terpercaya", template: "%s | Modesy" },
  description: "Marketplace untuk produk digital, fisik, dan lisensi dari vendor pilihan",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://modesy.com"),
  appleWebApp: { capable: true, title: "Modesy", statusBarStyle: "black-translucent" },
  other: { "mobile-web-app-capable": "yes" },
  openGraph: {
    type: "website",
    siteName: "Modesy",
    title: "Modesy - Marketplace Terpercaya",
    description: "Marketplace untuk produk digital, fisik, dan lisensi dari vendor pilihan",
    url: "/",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Modesy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modesy - Marketplace Terpercaya",
    description: "Marketplace untuk produk digital, fisik, dan lisensi dari vendor pilihan",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        {children}
        <Toaster />
        <RegisterSW />
      </body>
    </html>
  );
}
