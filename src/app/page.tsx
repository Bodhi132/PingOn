import { BentoGrid } from "@/components/landing/BentoGrid";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { PricingLimits } from "@/components/landing/PricingLimits";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#fafafa] text-neutral-950">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] [background-size:24px_24px]"
        aria-hidden
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BentoGrid />
        <PricingLimits />
      </main>
      <Footer />
    </div>
  );
}
