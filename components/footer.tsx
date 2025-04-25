// import Link from "next/link"

// export function Footer() {
//   return (
//     <footer className="border-t-2 border-[#CBCBCB] bg-[var(--background)] px-6 py-10">
//       <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row">
//         {/* Logo + Socials */}
//         <div className="flex items-center gap-6">
//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <img
//               src="/svgs/structure_word_logo.svg"
//               alt="Structure Logo"
//               className="h-8 w-auto"
//             />
//           </Link>

//           {/* Social Icons */}
//           <div className="flex gap-4 mt-[4px]">
//             <Link href="mailto:structure.create@gmail.com" aria-label="Email">
//               <img
//                 src="/svgs/mail.svg"
//                 alt="Mail Icon"
//                 className="h-5 w-auto hover:opacity-80 transition"
//               />
//             </Link>
//             <Link
//               href="https://www.linkedin.com/company/build-at-structure/"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="LinkedIn"
//             >
//               <img
//                 src="/svgs/linkedin.svg"
//                 alt="LinkedIn Icon"
//                 className="h-5 w-auto hover:opacity-80 transition"
//               />
//             </Link>
//           </div>
//         </div>

//         {/* Copyright */}
//         <p className="text-sm text-gray-500 text-center sm:text-right">
//           © {new Date().getFullYear()} Structure. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   )
// }

// components/Footer.tsx
import Link from "next/link";

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
          <p className="text-md "> For architects, by innovators</p>
          <p className="text-md"> Built in Los Angeles, California</p>
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