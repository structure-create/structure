import Link from "next/link"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 pb-10 bg-[var(--background)] shadow-sm">
      {/* Logo */}
      <Link href="/">
        <img
          src="/svgs/structure_word_logo.svg"
          alt="Structure Logo"
          className="h-10 w-auto"
        />
      </Link>

      {/* Buttons */}
      <div className="flex items-center space-x-4">
        <Link href="/demo">
          <p className="bg-[var(--accent)] text-[var(--background)] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[var(--hovaccent)] transition">
            TRY A DEMO
          </p>
        </Link>
        <Link href="/#contact">
          <p className="bg-[var(--background)] text-[var(--foreground)] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[var(--card)] transition">
            CONTACT US
          </p>
        </Link>
      </div>
    </header>
  )
}
