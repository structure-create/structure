import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--accent)] text-white ">
      <div className={`
        max-w-7xl mx-auto px-6 py-8
        flex flex-col
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
        <div className="text-sm flex flex-col gap-6 text-left md:items-end md:text-right md:mt-0 mt-8">
          <p className="font-bold text-white text-left md:text-right">For architects, by innovators</p>
          <p className="text-white text-left md:text-right">
            Built in Los Angeles, California
          </p>
        </div>
      </div>
      <div className={`
        max-w-7xl mx-auto px-6 py-6
        flex flex-col gap-y-10
        md:flex-row md:justify-between md:items-center
        md:gap-x-24 md:gap-y text-right
        `}>
          <p className="text-md"></p>
            <div className="text-xs text-white text-left md:text-right">
            © {new Date().getFullYear()} Structure
            </div>
        </div>
    </footer>
  );
}
