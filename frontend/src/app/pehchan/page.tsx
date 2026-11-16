import type { Metadata } from "next";
import { PresentationOrchestrator } from "@/components/presentation-orchestrator";

export const metadata: Metadata = {
  title: "Identity",
  description:
    "Clean power, intelligent systems. Authentic components, fair and transparent pricing, and trusted engineering support — Green Electronics Pakistan.",
};

export default function PehchanPage() {
  return <PresentationOrchestrator initialIndex={1} />;
}
