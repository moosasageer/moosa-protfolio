import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { prisma } from "@/lib/prisma";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } }).catch(() => null);
  return {
    title: settings?.siteTitle || "Moosa Sageer — Full-Stack Developer",
    description:
      settings?.siteDescription ||
      "Full-stack developer & AI/ML enthusiast building intelligent, memorable digital experiences.",
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
    icons: settings?.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">
        <div className="grain-overlay" aria-hidden />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
