// Home page
import { Header } from "@/components/header";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

            {/* Hero */}
            <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 -z-20">
                    <Image
                        src="/images/background_image.jpg"
                        alt="Construction background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-white opacity-70 -z-10" />

                {/* Content */}
                <div className="relative z-10 px-8 py-8 py-20 space-y-8">
                <h1 className="leading-none">
                    No Guesswork,<br />No Delays.
                </h1>
                <div className="rounded-lg mt-8 p-6 shadow-md max-w-xl"
                     style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                    <p className="text-base md:text-xl">
                    Connecting architects and contractors with city workflows. <br />
                    Run jurisdiction-specific compliance checks before submission. Teams can collaborate,
                    edit, and resolve issues early — cutting approval timelines by 2× and reducing costly resubmittals.
                    </p>
                </div>

                <Link href="/demo">
                    <p className="mt-8 w-fit inline-block bg-[var(--accent)] text-[#CD6026] text-[var(--background)] font-semibold text-lg px-6 py-3 rounded-md hover:bg-[var(--hovaccent)] transition">
                    Try a Demo
                    </p>
                </Link>
                </div>
            </section>

            {/* Feature #1 */}
            <section className="bg-[var(--card)]">
                <div className="max-w-6xl mx-auto flex flex-row items-center justify-between py-8 px-8 min-h-[500px]">
                    {/* Text Left */}
                    <div className="max-w-xl w-auto text-left space-y-6">
                    <h2 className="text-5xl leading-none">
                        Construction moves quickly, permits don’t.
                    </h2>
                    <p className="max-w-xl text-[var(--foreground)] text-base md:text-xl">
                        Structure helps you expedite the permit process by flagging risks by department,
                        grading by compliance, and streamlining feedback from officials.
                    </p>
                    <a
                        href="/demo"
                        className="text-[var(--accent)] font-semibold text-base hover:underline inline-flex items-center"
                    >
                        Try a Demo <span className="ml-8"> →</span>
                    </a>
                    </div>

                    {/* Placeholder Right */}
                    <div className="w-auto md:w-[500px] h-[300px] rounded-xl overflow-hidden ml-8">
                    <img
                        src="svgs/feature1.svg"
                        alt="UI Card 1"
                        className="h-full w-auto"
                    />
                    </div>
                </div>
            </section>

      {/* Feature #2 */}
      <section className="flex items-center justify-center py-8 px-8 bg-[var(--background)]">
        <div className="flex flex-col max-w-4xl mx-auto gap-6">
          <div className="flex flex-row">
            <img
              src="svgs/risk.svg"
              alt="Feature 1"
              className="h-200 w-auto rounded-lg"
            />
            <img
              src="svgs/grading.svg"
              alt="Feature 2"
              className="h-200 w-auto rounded-lg"
            />
          </div>
          <div className="flex flex-row">
            <img
              src="svgs/feedback.svg"
              alt="Feature 3"
              className="h-100 w-auto rounded-lg"
            />
            <img
              src="svgs/stakeholder.svg"
              alt="Feature 4"
              className="h-200 w-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Feature #3 */}
      <section className="bg-[var(--card)]">
          <div className="max-w-6xl mx-auto flex flex-row items-center justify-between py-8 px-8 min-h-[500px]">  
              {/* Text Left */}
              <div className="max-w-xl w-auto text-left space-y-6 pl-4">
                  <h2 className="text-5xl leading-none">
                      Submit your permit documents with confidence.
                  </h2>
                  <p className="max-w-xl text-[var(--foreground)] text-xl md:text-lg pr-8 ">
                      See code violations, see compliance grading, receive comments from 
                      co-workers and city officials, all with Structure.
                  </p>
              </div>

          {/* Placeholder Right */}
          <div className="w-auto h-[500px] md:w-[500px] h-[300px]rounded-xl overflow-hidden">
            <img
              src="svgs/feature3.svg"
              alt="UI Card 2"
              className="h-500 w-auto"
            />
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
}
