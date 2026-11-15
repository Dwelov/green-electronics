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
    default: "Green Electronics — Asal Khara Maal",
    template: "%s — Green Electronics",
  },
  description:
    "Karachi ki local hardware engineering. Asal products, wajib qeemat, bharosay ki service. Al-Karam Electronics Market, Saddar.",
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
