"use client"

import Link from "next/link";

import dynamic from "next/dynamic";


const FadeIn = dynamic(() => import("@/components/fadein"), {
  ssr: false,    // ← ensures it only loads on the client
});

export function Features() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 overflow-visible">
      <div className="grid grid-cols-2 grid-rows-3 gap-x-16 gap-y-40 items-start overflow-visible relative">
        {/* 1) Top-left */}
        <div className="col-start-1 row-start-1 relative z-20 md:-mr-16 lg:-mr-24 flex items-center space-x-6">
          <img
            src="/svgs/feature1.svg"
            alt="Compliance grading"
          />
        </div>

        {/* 2) Center-right */}
        <div className="col-start-2 row-start-2 relative z-10 md:-ml-16 lg:-ml-24 flex items-center space-x-6">
          <img
            src="/svgs/feature2.svg"
            alt="Readiness score"
          />
        </div>

        {/* 3) Bottom-left */}
        <div className="col-start-1 row-start-3 relative z-20 md:-mr-16 lg:-mr-24 flex items-center space-x-6">
          <img
            src="/svgs/feature3.svg"
            alt="Collaboration"
          />
        </div>
      </div>
    </div>
  );
}
