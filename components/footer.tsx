import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t-2 border-[#CBCBCB] bg-[var(--background)] px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row">
        {/* Logo + Socials */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/svgs/structure_word_logo.svg"
              alt="Structure Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Social Icons */}
          <div className="flex gap-4 mt-[6px]">
            <Link href="mailto:structure.create@gmail.com" aria-label="Email">
              <img
                src="/svgs/mail.svg"
                alt="Mail Icon"
                className="h-5 w-auto hover:opacity-80 transition"
              />
            </Link>
            <Link
              href="https://www.linkedin.com/company/build-at-structure/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img
                src="/svgs/linkedin.svg"
                alt="LinkedIn Icon"
                className="h-5 w-auto hover:opacity-80 transition"
              />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center sm:text-right">
          © {new Date().getFullYear()} Structure. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
