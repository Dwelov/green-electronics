import type { Metadata } from "next";
import { PresentationOrchestrator } from "@/components/presentation-orchestrator";

export const metadata: Metadata = {
  title: "Rabta",
  description:
    "Humse rabta karein — WhatsApp, phone, email ya Al-Karam Electronics Market, Saddar, Karachi. Response time under 15 minutes.",
};

export default function RabtaPage() {
  return <PresentationOrchestrator initialIndex={2} />;
}
