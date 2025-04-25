import Link from "next/link";

import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/PPNeueMontreal-Medium.otf",
  display: "swap",
  weight: "400",   // match the font’s native weight
  style: "normal",
});

export function Footer() {
  return (
    <footer className="bg-[var(--accent)] text-white py-16">
      <div className={`
        max-w-7xl mx-auto px-6 py-16
        flex flex-col gap-y-10
        md:flex-row md:justify-between md:items-center
        md:gap-x-24 md:gap-y
      `}>
        {/* Left block */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center">
            <img
              src="/svgs/word.svg"
              alt="Structure Logo"
              className="h-7 w-auto"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="mailto:structure.create@gmail.com" aria-label="Email">
              <img src="/svgs/mail.svg" alt="Email" className="h-5 w-auto" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/build-at-structure/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img src="/svgs/linkedin.svg" alt="LinkedIn" className="h-5 w-auto" />
            </Link>
          </div>
        </div>

        {/* Right block */}
        <div className="text-sm flex flex-col items-end gap-6 text-right">
        <p className={`${myFont.className} text-md font-bold`}>For architects, by innovators</p>
          <p className= "text-md">
            Built in Los Angeles, California
          </p>
        </div>
      </div>
      <div className={`
        max-w-7xl mx-auto px-6 py-16
        flex flex-col gap-y-10
        md:flex-row md:justify-between md:items-center
        md:gap-x-24 md:gap-y text-right
        `}>
          <p className="text-md"></p>
          <div className="text-sm flex flex-col items-end gap-6 text-right">
            <p className="text-md">© {new Date().getFullYear()} Structure</p>
          </div>
        </div>
    </footer>
  );
}