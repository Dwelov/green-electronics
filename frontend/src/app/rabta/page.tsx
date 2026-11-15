import type { Metadata } from "next";
import { PresentationOrchestrator } from "@/components/presentation-orchestrator";

export const metadata: Metadata = {
  title: "Rabta",
  description:
    "Humse rabta karein — WhatsApp ya call 0300 0841013, ya Model Town, Daska ke liye Google Maps directions. Coordinates: 32°19'39.8\"N 74°20'59.7\"E.",
};

export default function RabtaPage() {
  return <PresentationOrchestrator initialIndex={2} />;
}
