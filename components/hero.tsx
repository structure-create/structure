// components/Hero.tsx
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import React from "react";

// Decorative Cube component
function Cube({ className = "" }: { className?: string }) {
  return (
    <Image
      src="svgs/cube.svg"
      width={100}
      height={100}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none z-0 ${className}`}
    />
  );
}

export function Hero({
  setActiveUpload,
}: {
  setActiveUpload: (value: "permit" | "drawing") => void;
}) {
  const handleAnalyzeClick = () => {
    setActiveUpload("permit");
    const el = document.getElementById("upload-permit");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative w-full py-20 bg-[var(--background)] overflow-hidden">
      {/* Decorative cubes - moved further toward center */}
      <Cube className="absolute top-12 left-20 opacity-20 rotate-12 scale-150" />
      <Cube className="absolute bottom-16 right-20 opacity-15 scale-125 -rotate-6" />
      <Cube className="absolute top-1/3 right-1/4 opacity-10 scale-125 rotate-90" />
      <Cube className="absolute top-24 right-1/3 opacity-25 scale-150 rotate-45" />
      <Cube className="absolute bottom-20 left-1/4 opacity-30 scale-150 -rotate-30" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Heading + Subheading */}
          <div className="pt-24 space-y-8 max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-wide leading-tight text-navy-900">
              Compliance Before Submission
            </h1>
            <p className="text-gray-600 md:text-2xl leading-relaxed tracking-normal">
              Upload your building permit plans to instantly streamline your QA/QC
              process with automated analysis for compliance issues,
              regulatory concerns, and a compliance score.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={handleAnalyzeClick}
              className="w-64 bg-[var(--accent)] text-[var(--background)] px-4 py-3 rounded-sm font-semibold text-lg hover:bg-[var(--hovaccent)] transition"
            >
              Analyze Your Building Plan
            </button>
            <Link href="/">
              <p className="w-64 block bg-[var(--accent)] text-[var(--background)] px-4 py-3 rounded-sm font-semibold text-lg hover:bg-[var(--hovaccent)] transition">
                Learn More
              </p>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ArrowDown className="h-8 w-8 text-orange-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
