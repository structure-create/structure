// "use client"

// import Link from "next/link";

// import dynamic from "next/dynamic";


// const FadeIn = dynamic(() => import("@/components/fadein"), {
//   ssr: false,    // ← ensures it only loads on the client
// });

// export function Features() {
//   return (
//     <div className="max-w-6xl mx-auto px-6 py-12 overflow-visible">
//         <div className="flex flex-col space-y-6">
//             {/* Top: image left-justified */}
//             <div className="flex justify-start w-full">
//                 <img
//                 src="/svgs/feature1.svg"
//                 alt="Icon 1"
//                 />
//             </div>

//             {/* Middle: image right-justified */}
//             <div className="flex justify-end w-full">
//                 <img
//                 src="/svgs/feature2.svg"
//                 alt="Icon 2"
//                 />
//             </div>

//             {/* Bottom: image left-justified */}
//             <div className="flex justify-start w-full">
//                 <img
//                 src="/svgs/feature3.svg"
//                 alt="Icon 3"
//                 />
//             </div>
//         </div>
//     </div>
//   );
// }

"use client"

import dynamic from "next/dynamic"
import Link from "next/link"

const FadeIn = dynamic(() => import("@/components/fadein"), {
  ssr: false, // ensure this only loads on the client
})

export function Features() {
    const features = [
        {
          title: 'Compliance grading',
          description: 'Analyzes your plan and flags compliance errors prior to submission',
        },
        {
          title: 'Collaboration',
          description: 'Share plans with teams and receive comments',
        },
        {
          title: 'Readiness score',
          description: 'Provides compliance score with feedback to improve instantly',
        },
      ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* LEFT COLUMN */}
        <div className="flex flex-col justify-between">
        <div className="space-y-20">
            {/* Feature #1 */}
            <div>
            <h2 className="font-bold">Compliance grading</h2>
            <h4 className="mt-5">
                Analyzes your plan and flags compliance errors prior to submission
            </h4>
            </div>
            {/* Feature #2 */}
            <div>
            <h2 className="font-bold">Collaboration</h2>
            <h4 className="mt-5">
                Share plans with teams and receive comments
            </h4>
            </div>
            {/* Feature #3 */}
            <div>
            <h2 className="font-bold">Readiness score</h2>
            <h4 className="mt-5">
                Provides compliance score with feedback to improve instantly
            </h4>
            </div>
        </div>

        {/* now only 50% wide and left-aligned */}
        <a
            href="/demo"
            className="w-1/2 self-start mt-8 inline-block flex justify-center items-center px-8 py-4 bg-[#CD6026] hover:bg-[#A13E0A] text-white rounded-2xl"
        >
            Try a demo
        </a>
        </div>

        {/* RIGHT COLUMN with overlapping images */}
        <div className="relative w-full aspect-[4/5]">
        <img
            src="/svgs/blocks2.svg"
            alt="Feature Blocks"
            className="absolute inset-0 w-full h-auto"
        />
        <img
            src="/svgs/house.svg"
            alt="House Illustration"
            className="
            absolute 
            top-1/2 left-1/2 
            w-3/4 
            h-auto 
            transform -translate-x-1/2 -translate-y-1/2 
            object-contain 
            rounded-2xl
            "
        />
        </div>
    </div>
    </section>

  )
}
