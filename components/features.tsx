"use client"

import Link from "next/link";

import dynamic from "next/dynamic";


const FadeIn = dynamic(() => import("@/components/fadein"), {
  ssr: false,    // ← ensures it only loads on the client
});

export function Features() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 overflow-visible">
        <div className="flex flex-col space-y-6">
            {/* Top: image left-justified */}
            <div className="flex justify-start w-full">
                <img
                src="/svgs/feature1.svg"
                alt="Icon 1"
                />
            </div>

            {/* Middle: image right-justified */}
            <div className="flex justify-end w-full">
                <img
                src="/svgs/feature2.svg"
                alt="Icon 2"
                />
            </div>

            {/* Bottom: image left-justified */}
            <div className="flex justify-start w-full">
                <img
                src="/svgs/feature3.svg"
                alt="Icon 3"
                />
            </div>
        </div>
    </div>
  );
}
