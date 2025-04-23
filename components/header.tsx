"use client"; // needed since we’re using window

import Link from "next/link";

export function Header() {
  const redirectToCognitoLogin = () => {
    const clientId = "5u1cfh5oh8qm165bvrseutamnr";
    const redirectUri = "https://d84l1y8p4kdic.cloudfront.net"; // your app's redirect URI
    const cognitoDomain = "https://us-west-1tiknitkef.auth.us-west-1.amazoncognito.com";
    const loginUrl = `${cognitoDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = loginUrl;
  };

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

        {/* 🚀 Replaces Link with direct redirect */}
        <button
          onClick={redirectToCognitoLogin}
          className="bg-[var(--accent)] text-[var(--background)] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[var(--hovaccent)] transition"
        >
          LOGIN
        </button>

        <Link href="/#contact">
          <p className="bg-[var(--background)] text-[var(--foreground)] text-sm px-5 py-2 rounded-full font-semibold hover:bg-[var(--card)] transition">
            CONTACT US
          </p>
        </Link>
      </div>
    </header>
  );
}
