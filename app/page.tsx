"use client"

// Home page
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Intro } from "@/components/intro";
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
      <section className="flex items-center justify-center py-20 md:py-32 bg-[var(--background)] hover:shadow-2xl">
          <div className="container mx-auto px-4">
            <div className="w-2/5 mx-auto p-8 bg-white/5 rounded-3xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl">
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
          </div>
      </section>
      </FadeIn>
      <FadeIn>
        <Features />
      </FadeIn>
          <h1 className="inline-block h-[200px] mx-auto text-5xl md:text-7xl font-extrabold leading-tight text-[var(--background)]"> .
          </h1>
      <Footer />
    </div>
  );
}
