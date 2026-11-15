import type { Metadata } from "next";
import { PresentationOrchestrator } from "@/components/presentation-orchestrator";

export const metadata: Metadata = {
  title: "Pehchan",
  description:
    "Saaf bijli, samjhdaar cheezein. Asli products, wajib qeemat aur bharosay ki service — Green Electronics Pakistan.",
};

export default function PehchanPage() {
  return <PresentationOrchestrator initialIndex={1} />;
}
