
"use client"

// Home page
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Features } from "@/components/features";
import { Intro } from "@/components/intro";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";


const FadeIn = dynamic(() => import("@/components/fadein"), {
  ssr: false,    // ← ensures it only loads on the client
});

export default function Home() {
  return (
    <div className="py-20 bg-[var(--background)]">
      <Header />
      <FadeIn>
        <Intro/>
      </FadeIn>
      <FadeIn>
      <section className="flex items-center justify-center py-20 md:py-32  bg-[var(--background)]">
                <Image
                  src="/svgs/demo.svg"
                  alt="Illustration of stacked blocks"
                  width={1000}
                  height={1000}
                  className="object-contain"
                  priority
                />
      </section>
      </FadeIn>
      <FadeIn>
        <Features />
      </FadeIn>
        <section className=" bg-[var(--background)] flex justify-center items-center p-12 mb-32">
          <Link
              href="/demo"
              className="
                bg-[var(--accent)] text-[var(--background)]
                px-6 py-3 rounded-md
                hover:bg-[var(--hovaccent)]
                transition
              "
            >
              Try a Demo
            </Link>
          </section>
          <h1 className="inline-block h-[200px] mx-auto text-5xl md:text-7xl font-extrabold leading-tight text-[var(--background)]"> .
          </h1>
      <Footer />
    </div>
  );
}