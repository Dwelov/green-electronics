import type { Metadata } from "next";
import { PresentationOrchestrator } from "@/components/presentation-orchestrator";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Green Electronics — message us on WhatsApp, call the counter, or open Google Maps directions to our Model Town, Daska store. Coordinates: 32°19'39.8\"N 74°20'59.7\"E.",
};

export default function RabtaPage() {
  return <PresentationOrchestrator initialIndex={2} />;
}
