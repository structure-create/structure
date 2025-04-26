import Link from 'next/link'

const redirectToCognitoLogin = () => {
    const clientId = "5u1cfh5oh8qm165bvrseutamnr";
    const redirectUri = "https://d84l1y8p4kdic.cloudfront.net"; // your app's redirect URI
    const cognitoDomain = "https://us-west-1tiknitkef.auth.us-west-1.amazoncognito.com";
    const loginUrl = `${cognitoDomain}/login?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
    window.location.href = loginUrl;
  };

export function Intro() {
  return (
    
    <section className="max-w-7xl mx-auto px-8 py-12 overflow-visible relative">
      {/* grid is top-aligned */}
      <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* TEXT COLUMN */}
        <div
          className="flex flex-col h-full relative z-20 
                     md:mr-[-8rem] lg:mr-[-12rem] "
        >
        <div className = "gap-12">
          <p className="text-4xl md:text-8xl leading-tight pt-[40px]">
            Drawings to approvals. Faster.
          </p>
          <h3 className="mt-4">
            Quality control and compliance tool<br></br>for architects.
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

        {/* SVG SIDE */}
        <div className="relative z-10 flex justify-center md:justify-end">
          <img
            src="/svgs/blocks.svg"
            alt="Stacked compliance cubes graphic"
            className="w-full max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto"
          />
        </div>
      </div>
            {/* secondary callout */}
            <div
             className="
               space-y-16
               relative z-20
               md:-mt-32 lg:-mt-40                /* pull up */
             "
          >
        <p className="text-7xl">
            Construction moves <br /> fast, permits don’t.
        </p>
        <h4 className="max-w-2xl">
            Structure highlights code violations, grades your drawings on compliance,
            and allows teammates to leave comments and suggestions.
        </h4>
    </div>
    </section>
  )
}
