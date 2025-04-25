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
    <header className="flex items-center justify-between px-6 py-8 shadow-sm bg-[var(--background)] border-b border-[var(--accent)]">
      {/* Logo */}
      <div className="flex items-center gap-6">
      <img
        src="/svgs/menu.svg"
        alt="Menu"
        className="h-5 w-auto"
      />
      <Link href="/">
        <img
          src="/svgs/structure_word_logo.svg"
          alt="Structure Logo"
          className="h-10 w-auto"
        />
      </Link>
    </div>

      {/* Buttons */}
      <div className="flex items-center space-x-1">
        <Link href="/contactus">
        <button
            className="flex items-center space-x-2
                      bg-[var(--background)] text-[#CD6026]
                      text-sm px-5 py-2 rounded-full
                      hover:bg-[var(--card)] transition
                      font-semibold"
          >
            CONTACT US
          </button>
        </Link>

        <Link href="/demo">
          <button
            className="flex items-center space-x-2
                      bg-[var(--background)] text-[#CD6026]
                      text-sm px-5 py-2 rounded-full
                      hover:bg-[var(--card)] transition
                      font-semibold"
          >
            <span>TRY A DEMO</span>
            <img
              src="/svgs/arrow.svg"
              alt="→"
              className="h-4 w-auto"
            />
          </button>
        </Link>
      </div>
    </header>
  );
}
