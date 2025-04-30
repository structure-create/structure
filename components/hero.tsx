import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero({
  setActiveUpload,
}: {
  setActiveUpload: (value: "permit" | "drawing") => void;
}) {
  return (
    <section className="w-full py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Heading + Subheading */}
          <div className="space-y-8 max-w-3xl">
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
              onClick={() => setActiveUpload("permit")}
              className="w-64 block bg-[var(--accent)] text-[var(--background)] px-4 py-3 rounded-sm font-semibold text-lg hover:bg-[var(--hovaccent)] transition"
            >
              Analyze Your Building Plan
            </button>
            <button
              onClick={() => setActiveUpload("drawing")}
              className="w-64 block bg-[var(--accent)] text-[var(--background)] px-4 py-3 rounded-sm font-semibold text-lg hover:bg-[var(--hovaccent)] transition"
            >
              Analyze Your Drawing
            </button>
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
