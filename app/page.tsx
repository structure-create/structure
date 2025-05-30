"use client"

// Home page
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Intro } from "@/components/intro";
import { Faq } from "@/components/faq";
import Link from "next/link";
import dynamic from "next/dynamic";

const FadeIn = dynamic(() => import("@/components/fadein"), {
  ssr: false,    // ← ensures it only loads on the client
});

export default function Home() {
  return (
    <div className="bg-[var(--background)]">
      <Header />
      <FadeIn>
        <Intro/>
      </FadeIn>
      <FadeIn>
      <section className="flex items-center justify-center py-20 md:py-32 bg-[var(--background)] hover:shadow-2xl max-sm:hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Video Demo Column */}
              <div className="w-full p-8 bg-white/5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl">
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[2] border-8 border-[#CD6026] shadow-lg">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/web_demo2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* How It Works Column */}
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-[#CD6026]">How It Works</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-semibold">1. Upload Your Project</h3>
                    <p className="text-gray-600 pl-8">Easily import site diagrams or floor plans in PDF format.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-semibold">2. Run Intelligent Analysis</h3>
                    <p className="text-gray-600 pl-8">Leverage Structure's AI-powered tools to evaluate compliance, and generate insightful suggestions in real time.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-semibold">3. Collaborate Seamlessly</h3>
                    <p className="text-gray-600 pl-8">Invite team members, and manage revisions with version history and access control.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-semibold">4. Export & Share</h3>
                    <p className="text-gray-600 pl-8">Download design reports, and compliance summaries to share with clients.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
      </FadeIn>
      <FadeIn>
        <Features />
      </FadeIn>
      <FadeIn>
        <div className="max-sm:hidden">
          {/* Uncomment when completed */}
          {/* <Faq />  */}
        </div>
      </FadeIn>
          <h1 className="inline-block h-[200px] mx-auto text-5xl md:text-7xl font-extrabold leading-tight text-[var(--background)]"> .
          </h1>
      <Footer />
    </div>
  );
}
