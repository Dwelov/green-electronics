import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Green Electronics — Genuine Hardware & Engineering",
    template: "%s — Green Electronics",
  },
  description:
    "Local hardware engineering for Pakistan. Authentic components, fair and transparent pricing, and trusted engineering support — Green Electronics, Model Town, Daska (32°19'39.8\"N 74°20'59.7\"E).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      lang="en"
    >
      <body className="bg-surface font-sans text-ink">{children}</body>
    </html>
  );
}
