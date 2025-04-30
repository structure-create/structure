import Link from "next/link"
import { ArrowDown } from "lucide-react"

export function Hero({ setActiveUpload }: { setActiveUpload: (value: "permit" | "drawing") => void }) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[var(--background)]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-6">
            <p className="text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-navy-900">
            Compliance Before Submission {/* Streamline Your Construction Permit Compliance */}
            </p>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-2xl">
            Upload your building permit plans to instantly streamline your QA/QC process with automated analysis for compliance issues, regulatory concerns, and a compliance score.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6 justify-center">
            <Link href="#upload-permit">
              <button
                onClick={() => setActiveUpload("permit")}
                className="bg-[var(--accent)] text-[var(--background)] text-sm px-8 py-2 rounded-full font-semibold hover:bg-[var(--hovaccent)] transition"
              >
                Analyze Your Building Plan
              </button>
            </Link>
            <Link href="#upload-drawing">
              <button
                onClick={() => setActiveUpload("drawing")}
                className="bg-[var(--accent)] text-[var(--background)] text-sm px-8 py-2 rounded-full font-semibold hover:bg-[var(--hovaccent)] transition"
              >
                Analyze Your Drawing
              </button>
            </Link>
            {/* <Link href="/">
              <p className="bg-[var(--background)] text-[var(--foreground)] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[var(--border)] transition">
                Learn More
              </p>
            </Link> */}
          </div>
          <div className="mt-12 animate-bounce">
            <ArrowDown className="h-6 w-6 text-navy-700" />
          </div>
        </div>
        <section className="w-full py-12 md:py-24 lg:py-32">
        </section>
      </div>
    </section>
  )
}
