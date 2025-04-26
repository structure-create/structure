import Link from 'next/link'

const redirectToCognitoLogin = () => {
  const clientId = "5u1cfh5oh8qm165bvrseutamnr";
  const redirectUri = "https://d84l1y8p4kdic.cloudfront.net";
  const cognitoDomain = "https://us-west-1tiknitkef.auth.us-west-1.amazoncognito.com";
  window.location.href = 
    `${cognitoDomain}/login?response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export function Intro() {
  return (
    <section className="relative max-w-7xl mx-auto px-8 py-12 overflow-visible">
      {/* ——— Background SVG, perfectly centered behind the text ——— */}
      <img
        src="/svgs/blocks.svg"
        alt=""
        aria-hidden="true"
        className="
          absolute
          left-1/2 top-1/2 
          w-full max-w-4xl
          transform -translate-x-1/2 -translate-y-1/2 
          opacity-20
          pointer-events-none
          z-0
        "
      />

      {/* ——— Foreground content ——— */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* TEXT COLUMN */}
        <div className="flex flex-col h-full">
          <div className="gap-12">
            <p className="text-4xl md:text-8xl leading-tight pt-[40px]">
              Drawings to approvals. Faster.
            </p>
            <h3 className="mt-4 text-2xl md:text-4xl">
              Quality control and compliance tool<br/>for architects.
            </h3>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/demo">
                <p className="px-6 py-3 bg-[#CD6026] hover:bg-[#A13E0A] text-white rounded-[15px]">
                  Try a demo
                </p>
              </Link>
              <Link href="/signup">
                <p className="px-6 py-3 bg-[#FDE0CA] hover:bg-[#FFC3A5] text-[#CD6026] rounded-[15px]">
                  Create an account
                </p>
              </Link>
            </div>
          </div>
        </div>
        {/* empty right column to preserve two-col layout on md+ */}
        <div />
      </div>

      {/* ——— secondary callout ——— */}
      <div className="relative z-10 space-y-16 md:-mt-32 lg:-mt-40">
        <p className="text-7xl">
          Construction moves <br/> fast, permits don’t.
        </p>
        <h3 className="mt-4 text-2xl md:text-3xl">
          Structure highlights code violations, grades your <br/>drawings on compliance,
          and allows teammates<br/> to leave comments and suggestions.
        </h3>
      </div>
    </section>
  )
}
