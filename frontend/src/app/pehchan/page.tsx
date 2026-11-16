import type { Metadata } from "next";
import { PresentationOrchestrator } from "@/components/presentation-orchestrator";

export const metadata: Metadata = {
  title: "Services — Green Electronics",
  description:
    "Specialized appliance engineering & circuit board diagnostics. Air conditioner repair, microwave & oven restoration, washing machine overhaul, and PCB micro-soldering — Green Electronics Pakistan.",
};

export default function PehchanPage() {
  return <PresentationOrchestrator initialIndex={1} />;
}