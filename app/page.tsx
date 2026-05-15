"use client"

import { useState, useRef, useEffect, type CSSProperties } from "react"
import { motion, AnimatePresence, useScroll, useInView, useTransform } from "framer-motion"
import { Paperclip, ArrowUp } from "lucide-react"

// ── Asset paths ───────────────────────────────────────────────────────────────
const LOGO  = "/svgs/structure_word_logo.svg"
const CLIPS = [
  "/feature-clips/project.mp4",
  "/feature-clips/upload.mp4",
  "/feature-clips/flags.mp4",
  "/feature-clips/collab.mp4",
]
const TEAM = [
  { photo: "/team/arnav.png",  name: "Arnav Shah",    role: "PM",        linkedin: "https://www.linkedin.com/in/arnav-ashah/"  },
  { photo: "/team/olivia.png", name: "Olivia Nazari", role: "Designer",  linkedin: "https://www.linkedin.com/in/olivia-nazari/" },
  { photo: "/team/sonya.png",  name: "Sonya Alexis",  role: "Developer", linkedin: "https://www.linkedin.com/in/sonya-alexis/"  },
  { photo: "/team/rida.png",   name: "Rida Faraz",    role: "Developer", linkedin: "https://www.linkedin.com/in/rida-faraz/"    },
]
const STEPS = [
  { n: "01", title: "Configure Projects by Jurisdiction", desc: "Select a municipality and Structure automatically loads the relevant building codes, zoning rules, and permitting requirements for that location." },
  { n: "02", title: "Upload Plan Sets",                   desc: "Drop in a permit set and Structure instantly reviews every page against local code requirements." },
  { n: "03", title: "Flag Compliance Issues",             desc: "Structure pinpoints violations directly within your plans and references the exact code requirements." },
  { n: "04", title: "Collaborate with Your Team",         desc: "Review comments, resolve issues, and finalize plans together before submission." },
]

// ── Tokens ────────────────────────────────────────────────────────────────────
const FONT  = "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
const SANS  = FONT
const SERIF = FONT // display headings — same family as logo wordmark
const E     = [0.25, 0.4, 0.25, 1] as const

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E } },
}
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ── Parallax Grid — shared loop, section-scoped overlays ─────────────────────
const _gridEls = new Set<HTMLDivElement>()
let _gridLoopStarted = false

function _startGridLoop() {
  if (_gridLoopStarted || typeof window === 'undefined') return
  _gridLoopStarted = true
  let tx = 0, ty = 0, ax = 0, ay = 0
  window.addEventListener('mousemove', (e: MouseEvent) => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 28
    ty = (e.clientY / window.innerHeight - 0.5) * 28
  }, { passive: true })
  const tick = () => {
    ax += (tx - ax) * 0.06
    ay += (ty - ay) * 0.06
    const p = ax.toFixed(1) + 'px ' + ay.toFixed(1) + 'px'
    const pos = p + ', ' + p + ', ' + p + ', ' + p
    _gridEls.forEach(el => { el.style.backgroundPosition = pos })
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const GRID_BG = [
  'linear-gradient(rgba(130,118,100,0.045) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(130,118,100,0.045) 1px, transparent 1px)',
  'linear-gradient(rgba(130,118,100,0.018) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(130,118,100,0.018) 1px, transparent 1px)',
].join(', ')
const GRID_SIZE = '4rem 4rem, 4rem 4rem, 0.8rem 0.8rem, 0.8rem 0.8rem'

function GridOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    _startGridLoop()
    const el = ref.current!
    _gridEls.add(el)
    return () => { _gridEls.delete(el) }
  }, [])
  return (
    <div ref={ref} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: GRID_BG, backgroundSize: GRID_SIZE,
    }} />
  )
}

// ── Scroll Progress ───────────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        height: "2px", background: "var(--brand)",
        scaleX: scrollYProgress, transformOrigin: "left center",
      }}
    />
  )
}


// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY }             = useScroll()

  useEffect(() => scrollY.on("change", v => setScrolled(v > 60)), [scrollY])

  const links = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Team",         href: "#team"         },
    { label: "Request access", href: "#closing"    },
  ]

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <div style={{
        maxWidth: "min(90vw, 74rem)", margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "clamp(0.875rem,1.8vw,1.25rem) 0",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={LOGO} alt="Structure" style={{ height: "1.75rem", width: "auto" }} />
        </a>

        <div style={{ display: "flex", gap: "clamp(1.5rem,3vw,2.5rem)", alignItems: "center" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontFamily: SANS, fontSize: "clamp(0.875rem,1.2vw,0.9375rem)", fontWeight: 400,
              color: "var(--ink-2)", textDecoration: "none", transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ── App Mockup ────────────────────────────────────────────────────────────────
function AppMockup() {
  const flags = [
    {
      id: 1, sev: "error", expanded: true,
      title: "Staircase riser height exceeds maximum",
      desc: "Riser height of 8.25\" exceeds the maximum 7.75\" per code. Revise stair section.",
      citation: "LACC, Title 22, § 22.14.060 (2025)",
    },
    { id: 2, sev: "error", expanded: false, title: "Corridor width below minimum", desc: "", citation: "" },
    { id: 3, sev: "warning", expanded: false, title: "Window egress clearance", desc: "", citation: "" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: E, delay: 0.5 }}
      style={{
        width: "min(92vw, 62rem)", margin: "0 auto",
        borderRadius: 0,
        boxShadow: "0 clamp(1.5rem,4vw,3rem) clamp(3rem,8vw,6rem) rgba(0,0,0,0.1)",
        border: "1px solid #2A2A28", overflow: "hidden",
      }}>
      {/* Title bar */}
      <div style={{
        background: "#1C1C1E", display: "flex", alignItems: "center", gap: "0.75rem",
        padding: "0.625rem 1rem",
      }}>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => (
            <div key={c} style={{ width: "0.7rem", height: "0.7rem", borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "#3A3A3C", borderRadius: 0, padding: "0.2rem 1.5rem",
            fontFamily: SANS, fontSize: "0.7rem", color: "#AEAEB2", letterSpacing: "0.01em",
          }}>
            app.structure.build
          </div>
        </div>
        <div style={{ fontFamily: SANS, fontSize: "0.7rem", color: "#AEAEB2" }}>Share</div>
      </div>

      {/* App body */}
      <div style={{ display: "flex", background: "var(--surface)", minHeight: "22rem" }}>

        {/* Left panel */}
        <div className="hidden md:flex" style={{
          width: "28%", flexShrink: 0,
          borderRight: "1px solid var(--border)",
          flexDirection: "column",
          background: "#FAFAF9",
        }}>
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontFamily: SANS, fontSize: "0.65rem", fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.125rem" }}>
              Wilshire Mixed-Use
            </div>
            <div style={{ fontFamily: SANS, fontSize: "0.7rem", color: "var(--ink-3)" }}>Sheet A2.1 — Floor Plan</div>
          </div>

          <div style={{ padding: "0.625rem 0", flex: 1 }}>
            {flags.map(f => (
              <div key={f.id} style={{
                borderBottom: "1px solid var(--border)",
                background: f.expanded ? "var(--error-light)" : "transparent",
              }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", padding: "0.625rem 0.875rem" }}>
                  <div style={{
                    width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, marginTop: "0.2rem",
                    background: f.sev === "error" ? "var(--error)" : "var(--brand)",
                  }} />
                  <div style={{ fontFamily: SANS, fontSize: "0.7rem", fontWeight: 500, color: "var(--ink)", lineHeight: 1.4 }}>
                    {f.title}
                  </div>
                </div>
                {f.expanded && (
                  <div style={{ padding: "0 0.875rem 0.75rem 1.75rem" }}>
                    <div style={{ fontFamily: SANS, fontSize: "0.65rem", color: "var(--ink-2)", lineHeight: 1.5, marginBottom: "0.375rem" }}>
                      {f.desc}
                    </div>
                    <div style={{
                      fontFamily: SANS, fontSize: "0.6rem", fontWeight: 600,
                      color: "var(--brand)", background: "var(--brand-light)",
                      padding: "0.15rem 0.375rem", display: "inline-block", borderRadius: 0,
                    }}>
                      {f.citation}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Comment */}
            <div style={{ padding: "0.75rem 0.875rem", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <div style={{
                  width: "1.25rem", height: "1.25rem", borderRadius: "50%", flexShrink: 0,
                  background: "#E8F0FE", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: SANS, fontSize: "0.5rem", fontWeight: 700, color: "#3B82F6",
                }}>
                  IL
                </div>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: "0.65rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.125rem" }}>Iris Leung</div>
                  <div style={{ fontFamily: SANS, fontSize: "0.63rem", color: "var(--ink-2)", lineHeight: 1.4 }}>
                    Can you check the dimension on the east corridor?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floor plan */}
        <div style={{ flex: 1, padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
          <svg viewBox="0 0 540 340" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: "38rem" }}>
            {/* Grid lines */}
            {[0,1,2,3,4,5].map(i => (
              <line key={`gh${i}`} x1="20" y1={20 + i*55} x2="520" y2={20 + i*55} stroke="#DDD9D2" strokeWidth="0.5"/>
            ))}
            {[0,1,2,3,4,5,6,7,8].map(i => (
              <line key={`gv${i}`} x1={20 + i*63} y1="20" x2={20 + i*63} y2="320" stroke="#DDD9D2" strokeWidth="0.5"/>
            ))}

            {/* Outer walls */}
            <rect x="30" y="30" width="480" height="280" fill="none" stroke="#1A1714" strokeWidth="3"/>

            {/* Interior walls */}
            <line x1="190" y1="30" x2="190" y2="185" stroke="#1A1714" strokeWidth="2"/>
            <line x1="190" y1="215" x2="190" y2="310" stroke="#1A1714" strokeWidth="2"/>
            <line x1="190" y1="185" x2="220" y2="185" stroke="#1A1714" strokeWidth="2"/>
            <line x1="220" y1="200" x2="190" y2="200" stroke="#1A1714" strokeWidth="2"/>
            <line x1="220" y1="185" x2="220" y2="310" stroke="#1A1714" strokeWidth="2"/>
            <line x1="350" y1="30" x2="350" y2="175" stroke="#1A1714" strokeWidth="2"/>
            <line x1="350" y1="205" x2="350" y2="310" stroke="#1A1714" strokeWidth="2"/>
            <line x1="350" y1="175" x2="380" y2="175" stroke="#1A1714" strokeWidth="2"/>
            <line x1="380" y1="175" x2="380" y2="205" stroke="#1A1714" strokeWidth="2"/>
            <line x1="380" y1="205" x2="350" y2="205" stroke="#1A1714" strokeWidth="2"/>
            <line x1="220" y1="200" x2="350" y2="200" stroke="#1A1714" strokeWidth="2"/>

            {/* Door arcs */}
            <path d="M 190 120 Q 220 120 220 150" fill="none" stroke="#1A1714" strokeWidth="1.5"/>
            <line x1="190" y1="120" x2="220" y2="120" stroke="#1A1714" strokeWidth="1"/>
            <path d="M 350 120 Q 380 120 380 150" fill="none" stroke="#1A1714" strokeWidth="1.5"/>
            <line x1="350" y1="120" x2="380" y2="120" stroke="#1A1714" strokeWidth="1"/>

            {/* Room labels */}
            <text x="110" y="110" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">LIVING</text>
            <text x="110" y="122" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">ROOM</text>
            <text x="110" y="260" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">BATHROOM</text>
            <text x="280" y="100" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">DINING</text>
            <text x="280" y="265" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">KITCHEN</text>
            <text x="435" y="100" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">BEDROOM 1</text>
            <text x="435" y="265" textAnchor="middle" fill="#9A9590" fontSize="9" fontFamily="Inter" letterSpacing="1">BEDROOM 2</text>
            <text x="205" y="100" textAnchor="middle" fill="#9A9590" fontSize="8" fontFamily="Inter" letterSpacing="0.5">STAIR</text>

            {/* Stair indicator */}
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="190" y1={185 - i * 16} x2="220" y2={185 - i * 16} stroke="#9A9590" strokeWidth="1"/>
            ))}

            {/* Error circle 1: staircase */}
            <circle cx="205" cy="160" r="32" fill="rgba(232,100,90,0.08)" stroke="#E8645A" strokeWidth="2" strokeDasharray="5 3"/>
            <text x="240" y="138" fill="#E8645A" fontSize="8.5" fontFamily="Inter" fontWeight="600">① Riser height</text>

            {/* Error circle 2: corridor */}
            <circle cx="285" cy="200" r="22" fill="rgba(232,100,90,0.08)" stroke="#E8645A" strokeWidth="2" strokeDasharray="5 3"/>
            <text x="312" y="196" fill="#E8645A" fontSize="8.5" fontFamily="Inter" fontWeight="600">② Width</text>

            {/* Comment pin */}
            <circle cx="435" cy="200" r="11" fill="#3B82F6"/>
            <text x="435" y="205" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" fontWeight="700">1</text>

            {/* Dimension lines */}
            <line x1="30" y1="15" x2="510" y2="15" stroke="#9A9590" strokeWidth="0.75" markerEnd="url(#arr)"/>
            <text x="270" y="11" textAnchor="middle" fill="#9A9590" fontSize="7" fontFamily="Inter">48&apos;-0&quot;</text>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Text fades + lifts
  const textOpacity = useTransform(scrollYProgress, [0, 0.09, 1], [1, 0, 0])
  const textY       = useTransform(scrollYProgress, [0, 0.03, 1], [0, -40, -40])

  // Image rises then holds — no zoom
  const imgY = useTransform(scrollYProgress, [0, 0.35, 1], ["47vh", "0vh", "0vh"])

  return (
    <section ref={sectionRef} style={{ height: "400vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        overflow: "hidden", background: "var(--bg)",
      }}>
        <GridOverlay />
        {/* Text — upper portion, centered */}
        <motion.div style={{
          opacity: textOpacity, y: textY,
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center",
          paddingTop: "clamp(4.5rem,8vw,6rem)",
          paddingLeft: "1rem", paddingRight: "1rem",
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E }}
            style={{
              fontFamily: SERIF, fontWeight: 500,
              fontSize: "clamp(2.8rem,5.5vw,4.5rem)",
              color: "var(--ink)", lineHeight: 1.05, letterSpacing: "-0.025em",
              marginBottom: "clamp(0.75rem,1.5vw,1rem)",
            }}>
            Get Your Plans <br />Approved Faster.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: E }}
            style={{
              fontFamily: SANS, fontWeight: 400,
              fontSize: "clamp(0.9375rem,1.4vw,1.0625rem)",
              color: "var(--ink-2)", lineHeight: 1.8,
              maxWidth: "46ch", marginBottom: "clamp(1rem,1.8vw,1.5rem)",
            }}>
            Architects are losing weeks to city review cycles caused by minor compliance issues. Structure flags them before submission so your plans get approved <span style={{ fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}>the first time.</span>
          </motion.p>
          <motion.a
            href="https://cal.com/arnavashah/30min"
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5, ease: E }}
            style={{
              display: "inline-block", fontFamily: SANS, fontWeight: 500,
              fontSize: "clamp(0.875rem,1.3vw,1rem)",
              color: "white", background: "var(--brand)",
              textDecoration: "none", padding: "0.875em 2em", borderRadius: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--brand-dark)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--brand)")}>
            Request a Demo
          </motion.a>
        </motion.div>

        {/* Demo image — centered below nav bar at max zoom, no zoom-out */}
        <motion.div style={{
          y: imgY,
          position: "absolute", inset: 0,
          paddingTop: "4.25rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999,
        }}>
          <div style={{ position: "relative", width: "min(90vw, 76rem)", maxHeight: "82vh" }}>
            <img
              src="/images/demo.png"
              alt="Structure app"
              style={{ width: "100%", maxHeight: "82vh", objectFit: "contain", display: "block" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}


// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [val, setVal]  = useState(0)
  const ref            = useRef<HTMLSpanElement>(null)
  const inView         = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const startTime = performance.now()
    const duration  = 1200
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * end))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, end])

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ── Problem Section ───────────────────────────────────────────────────────────
function ProblemSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    { end: 40,     prefix: "",  suffix: "%", label: "of permit applications rejected on first submission" },
    { end: 6,      prefix: "",  suffix: " weeks", label: "lost per rejection cycle, on average" },
    { end: 24600,  prefix: "$", suffix: "",  label: "monthly holding cost per idle project" },
    { end: 69000,  prefix: "",  suffix: "+", label: "architects in the US who need this" },
  ]

  return (
    <section style={{
      background: "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(193,98,42,0.06) 0%, transparent 70%), var(--surface)",
      borderTop: "1px solid var(--border)",
      paddingTop: "clamp(4rem,8vw,7rem)",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: E }}
        style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vw,4rem)", padding: "0 clamp(1rem,4vw,2rem)" }}
      >
        <p style={{
          fontFamily: SANS, fontWeight: 500, letterSpacing: "0.12em",
          fontSize: "0.75rem", textTransform: "uppercase",
          color: "var(--brand)", marginBottom: "0.75rem",
        }}>
          The problem is real
        </p>
        <h2 style={{
          fontFamily: SERIF, fontWeight: 500,
          fontSize: "clamp(2rem,4vw,3rem)",
          color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.1,
          maxWidth: "22ch", margin: "0 auto",
        }}>
          Compliance failures cost architects months.
        </h2>
      </motion.div>

      <div ref={ref} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))",
        borderTop: "1px solid var(--border)",
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.7, ease: E }}
            style={{
              padding: "clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,1.5rem)",
              borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              textAlign: "center",
              background: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
              transition: "background 0.2s",
              cursor: "default",
            }}
          >
            <div style={{
              fontFamily: SERIF, fontWeight: 500,
              fontSize: "clamp(2.2rem,4vw,3.5rem)",
              color: "var(--brand)", lineHeight: 1, marginBottom: "0.5rem",
            }}>
              <AnimatedCounter end={s.end} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div style={{
              fontFamily: SANS, fontSize: "clamp(0.75rem,1.2vw,0.85rem)",
              color: "var(--ink-3)", lineHeight: 1.5, maxWidth: "16ch", margin: "0 auto",
            }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Feature clip (plays when its step is active) ─────────────────────────────
function FeatureClip({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (active) {
      el.currentTime = 0
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [active, src])

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="auto"
      style={{
        width: "100%",
        display: "block",
        opacity: active ? 1 : 0,
        transition: "opacity 0.35s ease",
        position: active ? "relative" : "absolute",
        zIndex: active ? 2 : 0,
        inset: active ? undefined : 0,
        pointerEvents: active ? "auto" : "none",
      }}
    />
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
const HIW_STICKY_TOP = "4.25rem"

const hiwVideoFrame: CSSProperties = {
  position: "relative",
  border: "2px solid var(--brand)",
  borderRadius: 0,
  overflow: "hidden",
  background: "#111",
  boxShadow: "0 2rem 5rem rgba(0,0,0,0.35), 0 0.5rem 1.5rem rgba(0,0,0,0.2)",
  aspectRatio: "16 / 10",
  width: "100%",
}

function HowItWorks() {
  const [active, setActive] = useState(0)
  const sectionRef          = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const unsub = scrollYProgress.on("change", v => {
      const step = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))
      setActive(step)
    })
    return unsub
  }, [scrollYProgress])

  return (
    <section id="how-it-works" style={{ background: "var(--bg)", position: "relative", borderBottom: "1px solid var(--border)" }}>
      <GridOverlay />
      {/* Centered intro */}
      <div style={{
        textAlign: "center",
        padding: "clamp(3rem,6vw,5rem) clamp(1rem,4vw,2rem) clamp(2rem,4vw,3rem)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          marginBottom: "clamp(1rem,2vw,1.5rem)",
        }}>
          <div style={{ height: "1px", width: "1.5rem", background: "var(--border)" }} />
          <span style={{ fontFamily: SANS, fontSize: "clamp(0.7rem,1vw,0.75rem)", fontWeight: 600, color: "var(--brand)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            How it works
          </span>
          <div style={{ height: "1px", width: "1.5rem", background: "var(--border)" }} />
        </div>
        <h2 style={{
          fontFamily: SERIF, fontWeight: 500,
          fontSize: "clamp(2.15rem,4.6vw,3.6rem)",
          color: "var(--ink)", lineHeight: 1.05,
          letterSpacing: "-0.02em",
          maxWidth: "18ch", margin: "0 auto clamp(2rem,4vw,3rem)",
        }}>
          From upload to approval-ready in minutes.
        </h2>

      </div>

      {/* Sticky scroll — always on */}
      <div ref={sectionRef} style={{ height: "600vh", position: "relative", padding: "0 clamp(0.75rem,2vw,2rem)" }}>
        <div style={{
          position: "sticky",
          top: HIW_STICKY_TOP,
          height: `calc(100vh - ${HIW_STICKY_TOP})`,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          borderTop: "1px solid var(--border)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.10), 0 2px 12px rgba(0,0,0,0.06)",
        }}>

          {/* Left: text */}
          <div style={{
            flex: "0 0 48%",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "clamp(2rem, 4vw, 5rem)",
            position: "relative", overflow: "hidden",
            background: "var(--bg)",
            borderRight: "1px solid var(--border)",
          }}>
            {/* Ghost step number */}
            <div style={{
              position: "absolute",
              fontFamily: SERIF, fontWeight: 700,
              fontSize: "clamp(8rem, 18vw, 16rem)",
              color: "var(--brand)", opacity: 0.06,
              bottom: "-1rem", right: "1rem",
              lineHeight: 1, userSelect: "none", pointerEvents: "none",
              letterSpacing: "-0.05em",
              transition: "opacity 0.3s",
            }}>
              {STEPS[active].n}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: E }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <div style={{
                  fontFamily: SANS, fontSize: "clamp(0.7rem,1vw,0.8rem)", fontWeight: 600,
                  color: "var(--brand)", letterSpacing: "0.12em", textTransform: "uppercase",
                  marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
                }}>
                  Step {STEPS[active].n}
                </div>
                <h3 style={{
                  fontFamily: SERIF, fontWeight: 500,
                  fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
                  color: "var(--ink)", lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
                }}>
                  {STEPS[active].title}
                </h3>
                <p style={{
                  fontFamily: SANS,
                  fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
                  color: "var(--ink-2)", lineHeight: 1.8, maxWidth: "38ch",
                }}>
                  {STEPS[active].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Step dots */}
            <div style={{ position: "absolute", bottom: "clamp(2rem,4vw,3rem)", left: "clamp(2rem, 4vw, 5rem)", display: "flex", gap: "0.5rem" }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: "2px", borderRadius: 0,
                  width: i === active ? "2rem" : "0.5rem",
                  background: i === active ? "var(--brand)" : "var(--border)",
                  transition: "width 0.3s ease, background 0.3s ease",
                }} />
              ))}
            </div>
          </div>

          {/* Right: video */}
          <div style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "clamp(1.5rem, 3vw, 3rem)",
            background: "#F4F1EC",
            position: "relative", zIndex: 9999,
          }}>
            <div style={{ width: "100%", maxWidth: "44rem" }}>
              <div style={hiwVideoFrame}>
                {CLIPS.map((src, i) => (
                  <FeatureClip key={src} src={src} active={i === active} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const ref1    = useRef<HTMLDivElement>(null)
  const inView1 = useInView(ref1, { once: true, amount: 0.2 })
  const ref2    = useRef<HTMLDivElement>(null)
  const inView2 = useInView(ref2, { once: true, amount: 0.2 })

  const FLAGS = [
    { title: "Staircase riser height exceeds maximum", desc: "Riser height of 8.25\" exceeds the maximum 7.75\" per code.", citation: "LACC, Title 22, § 22.14.060 (2025)", sev: "error" },
    { title: "Corridor width below minimum",           desc: "Minimum clear width of 44\" required. Current: 38\".",        citation: "CBC § 1005.1 (2022)",                sev: "error" },
    { title: "Window egress clearance insufficient",   desc: "Net clear opening area of 4.2 sq ft required. Current: 3.6 sq ft.", citation: "CBC § 1030.2 (2022)",          sev: "warning" },
  ]
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % FLAGS.length), 2400)
    return () => clearInterval(id)
  }, [FLAGS.length])

  const AVATARS = [
    { init: "AS", bg: "#E8E8E7", col: "#6B6B6B" },
    { init: "IL", bg: "#DEDEDC", col: "#5A5A58" },
    { init: "MK", bg: "#E4E4E2", col: "#626260" },
    { init: "RJ", bg: "#DADAD8", col: "#545452" },
  ]

  const FlagCard = () => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--brand)", overflow: "hidden", position: "relative", boxShadow: "0 8px 32px rgba(193,98,42,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}>
      {/* Dot grid texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.625rem", position: "relative" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--error)" }} />
        <span style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Plan Review</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: SANS, fontSize: "0.6rem", color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sheet A2.1</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "var(--error-light)", border: "1px solid var(--error)", padding: "0.15rem 0.5rem" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--error)" }} />
            <span style={{ fontFamily: SANS, fontSize: "0.6rem", fontWeight: 700, color: "var(--error)", letterSpacing: "0.06em" }}>3 ISSUES</span>
          </div>
        </div>
      </div>

      {/* Cycling violation */}
      <div style={{ padding: "1.5rem 1.25rem", minHeight: "9.5rem", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.32, ease: E }}
            style={{ position: "absolute", inset: "1.5rem 1.25rem" }}>
            <div style={{ borderLeft: `3px solid ${FLAGS[active].sev === "error" ? "var(--error)" : "var(--brand)"}`, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              <span style={{
                display: "inline-flex", alignSelf: "flex-start",
                fontFamily: SANS, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em",
                color: FLAGS[active].sev === "error" ? "var(--error)" : "var(--brand)",
                background: FLAGS[active].sev === "error" ? "var(--error-light)" : "#FFF3EB",
                border: `1px solid ${FLAGS[active].sev === "error" ? "var(--error)" : "var(--brand)"}`,
                padding: "0.15rem 0.5rem",
              }}>
                {FLAGS[active].sev === "error" ? "ERROR" : "WARNING"}
              </span>
              <h4 style={{ fontFamily: SANS, fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.4, margin: 0 }}>
                {FLAGS[active].title}
              </h4>
              <p style={{ fontFamily: SANS, fontSize: "0.75rem", color: "var(--ink-2)", lineHeight: 1.65, margin: 0 }}>
                {FLAGS[active].desc}
              </p>
              <span style={{ fontFamily: "monospace", fontSize: "0.6875rem", color: FLAGS[active].sev === "error" ? "var(--error)" : "var(--brand)", letterSpacing: "0.02em", opacity: 0.7 }}>
                {FLAGS[active].citation}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", gap: "0.3rem", alignItems: "center" }}>
        {FLAGS.map((_, i) => (
          <div key={i} style={{ height: "2px", flex: i === active ? 2.5 : 1, background: i === active ? "var(--brand)" : "var(--border)", borderRadius: 1, transition: "flex 0.4s ease, background 0.3s" }} />
        ))}
        <span style={{ fontFamily: SANS, fontSize: "0.6rem", color: "var(--ink-3)", marginLeft: "0.625rem", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
          {active + 1} / {FLAGS.length}
        </span>
      </div>
    </div>
  )

  const CollabCard = () => (
    <div style={{ background: "var(--surface)", border: "1px solid var(--brand)", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(193,98,42,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}>
      {/* Header — overlapping avatars + status */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ display: "flex" }}>
          {AVATARS.map((a, i) => (
            <div key={i} style={{ position: "relative", marginLeft: i > 0 ? "-8px" : 0, zIndex: AVATARS.length - i }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 700, color: a.col, fontFamily: SANS, border: "2px solid var(--surface)" }}>
                {a.init}
              </div>
              {i < 2 && <div style={{ position: "absolute", bottom: 1, right: 1, width: 7, height: 7, borderRadius: "50%", background: "#4ade80", border: "1.5px solid var(--surface)" }} />}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: SANS, fontSize: "0.8125rem", fontWeight: 600, color: "var(--ink)" }}>Sunset Park Review</div>
          <div style={{ fontFamily: SANS, fontSize: "0.6875rem", color: "var(--ink-3)" }}>2 members active now</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {/* Message bubble */}
        <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-end" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: AVATARS[0].bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 700, color: AVATARS[0].col, fontFamily: SANS, flexShrink: 0 }}>
            {AVATARS[0].init}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <span style={{ fontFamily: SANS, fontSize: "0.6rem", color: "var(--ink-3)", paddingLeft: "0.125rem" }}>Marcus L.</span>
            <div style={{ background: "#F2EFE9", padding: "0.625rem 0.875rem", borderRadius: "2px 10px 10px 10px", maxWidth: "18rem" }}>
              <span style={{ fontFamily: SANS, fontSize: "0.8125rem", color: "var(--ink-2)", lineHeight: 1.55 }}>Can you double-check the egress widths on level 2?</span>
            </div>
          </div>
        </div>

        {/* Typing indicator */}
        <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-end" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: AVATARS[1].bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: 700, color: AVATARS[1].col, fontFamily: SANS, flexShrink: 0 }}>
            {AVATARS[1].init}
          </div>
          <div style={{ background: "#F2EFE9", padding: "0.75rem 1rem", borderRadius: "2px 10px 10px 10px", display: "flex", gap: "0.35rem", alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <motion.span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#a8a29e", display: "block" }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: "0 1.25rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", background: "#F8F6F3", border: "1px solid var(--border)", padding: "0.625rem 0.875rem", gap: "0.625rem" }}>
          <Paperclip size={13} color="var(--ink-3)" style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, fontFamily: SANS, fontSize: "0.75rem", color: "rgba(107,107,107,0.5)" }}>Add a comment…</span>
          <div style={{ width: 24, height: 24, background: "var(--ink)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowUp size={12} color="white" />
          </div>
        </div>
      </div>
    </div>
  )

  const ROW: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "clamp(2rem,5vw,5rem)",
    alignItems: "center",
  }
  const TEXT: CSSProperties = {
    display: "flex", flexDirection: "column", gap: "1rem",
  }

  return (
    <section id="features" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", padding: "clamp(4rem,8vw,7rem) clamp(1rem,4vw,2rem)" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(4rem,8vw,6rem)" }}>

        {/* Row 1 — text left, card right */}
        <motion.div ref={ref1} style={ROW}
          initial={{ opacity: 0, y: 24 }} animate={inView1 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: E }}>
          <div style={TEXT}>
            <p style={{ fontFamily: SANS, fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Compliance Checking</p>
            <h3 style={{ fontFamily: SERIF, fontSize: "clamp(1.5rem,2.5vw,2.25rem)", fontWeight: 500, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Catch compliance issues before the city does.
            </h3>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.9rem,1.3vw,1rem)", color: "var(--ink-2)", lineHeight: 1.75 }}>
              Structure reviews your plans like a municipal plan checker, scanning every sheet, flagging violations, and citing the exact applicable code sections.
            </p>
          </div>
          <FlagCard />
        </motion.div>

        {/* Row 2 — card left, text right */}
        <motion.div ref={ref2} style={ROW}
          initial={{ opacity: 0, y: 24 }} animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: E }}>
          <CollabCard />
          <div style={TEXT}>
            <p style={{ fontFamily: SANS, fontSize: "0.75rem", fontWeight: 600, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Team Collaboration</p>
            <h3 style={{ fontFamily: SERIF, fontSize: "clamp(1.5rem,2.5vw,2.25rem)", fontWeight: 500, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Keep your whole team aligned in real time.
            </h3>
            <p style={{ fontFamily: SANS, fontSize: "clamp(0.9rem,1.3vw,1rem)", color: "var(--ink-2)", lineHeight: 1.75 }}>
              Comment directly on plan sheets, tag teammates, and resolve issues together - no more back-and-forth over email or scattered markups.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ── Meet The Team ─────────────────────────────────────────────────────────────
function MeetTheTeam() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  return (
    <section id="team" ref={ref} style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", padding: "clamp(4rem,8vw,7rem) clamp(1rem,4vw,2rem)" }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: E }}
          style={{ fontFamily: SERIF, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 500, color: "var(--ink)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
          The founding team.
        </motion.h2>
        <p style={{ fontFamily: SANS, fontSize: "clamp(0.8125rem,1.1vw,0.9375rem)", fontWeight: 600, color: "var(--brand)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "clamp(2.5rem,5vw,4rem)" }}>
          Building the future of architectural compliance review.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "clamp(1.5rem,3vw,2.5rem)" }}>
          {TEAM.map((m, i) => (
            <motion.a
              key={m.name} href={m.linkedin} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: E }}
              style={{ textDecoration: "none", display: "block" }}>
              <img src={m.photo} alt={m.name} style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top", display: "block", border: "1px solid var(--border)", marginBottom: "0.875rem" }} />
              <div style={{ fontFamily: SANS, fontSize: "0.9375rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.2rem" }}>{m.name}</div>
              <div style={{ fontFamily: SANS, fontSize: "0.8125rem", color: "var(--ink-3)" }}>{m.role}</div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Closing CTA ───────────────────────────────────────────────────────────────
function ClosingCTA() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [email, setEmail] = useState("")
  const [done, setDone]   = useState(false)

  return (
    <section id="closing" style={{ background: "var(--brand)", padding: "clamp(4rem,8vw,7rem) clamp(1rem,4vw,2rem)", position: "relative", overflow: "hidden" }}>
      {/* Texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(#A8501F 1px, transparent 1px), linear-gradient(90deg, #A8501F 1px, transparent 1px)`,
        backgroundSize: "2.5rem 2.5rem", opacity: 0.12,
      }} />

      <motion.div ref={ref}
        variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ maxWidth: "min(90vw, 44rem)", margin: "0 auto", textAlign: "center", position: "relative" }}>
        <motion.h2 variants={fadeUp} style={{
          fontFamily: SERIF, fontWeight: 500,
          fontSize: "clamp(1.8rem,4vw,3rem)",
          color: "white", lineHeight: 1.2, marginBottom: "1rem",
        }}>
          Construction moves fast. Permits should too.
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontFamily: SANS, fontSize: "clamp(0.9rem,1.4vw,1rem)", color: "rgba(255,255,255,0.75)", marginBottom: "2rem", lineHeight: 1.7 }}>
          Join the architects already building faster with Structure.
        </motion.p>

        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
                onSubmit={e => { e.preventDefault(); if (email) setDone(true) }}
                style={{ display: "flex", maxWidth: "28rem", margin: "0 auto", flexWrap: "wrap", gap: "0" }}>
                <style>{`.cta-email::placeholder { color: rgba(255,255,255,0.9); }`}</style>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="cta-email"
                  style={{
                    flex: "1 1 12rem", padding: "0.875rem 1.25rem",
                    fontFamily: SANS, fontSize: "clamp(0.875rem,1.4vw,1rem)",
                    background: "rgba(255,255,255,0.15)", color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRight: "none", outline: "none", borderRadius: 0,
                  }}
                />
                <motion.button type="submit" whileTap={{ scale: 0.97 }}
                  style={{
                    flex: "0 0 auto", padding: "0.875rem 1.75rem",
                    fontFamily: SANS, fontSize: "clamp(0.875rem,1.4vw,1rem)", fontWeight: 500,
                    background: "white", color: "var(--brand)",
                    border: "1px solid white", cursor: "pointer", borderRadius: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--brand-light)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "white")}>
                  Request access
                </motion.button>
              </motion.form>
            ) : (
              <motion.div key="done"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: E }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", color: "white" }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                  <motion.path d="M 8 14 L 12 18 L 20 10"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  />
                </svg>
                <span style={{ fontFamily: SANS, fontSize: "clamp(1rem,1.6vw,1.125rem)", fontWeight: 500 }}>
                  You&apos;re on the list!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const product = [
    { label: "How it works", href: "#how-it-works" },
  ]
  const company = [
    { label: "Team",    href: "#team"    },
    { label: "Contact", href: "#closing" },
  ]

  return (
    <footer style={{
      background: "var(--bg)",
      borderTop: "1px solid var(--border)",
    }}>
      {/* Main footer body */}
      <div style={{
        maxWidth: "min(92vw, 76rem)", margin: "0 auto",
        padding: "clamp(3rem,6vw,5rem) 0",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "clamp(2rem,5vw,4rem)",
        alignItems: "start",
      }}>
        {/* Brand */}
        <div>
          <img src={LOGO} alt="Structure" style={{ height: "1.25rem", width: "auto", marginBottom: "1rem" }} />
          <p style={{
            fontFamily: SANS, fontSize: "0.875rem",
            color: "var(--ink-3)", lineHeight: 1.7,
            maxWidth: "28ch", marginBottom: "1.5rem",
          }}>
            AI-powered compliance and QA/QC for architects. Get plans approved the first time.
          </p>
          <a
            href="https://cal.com/arnavashah/30min"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block", fontFamily: SANS, fontWeight: 500,
              fontSize: "0.8125rem", color: "var(--brand)",
              textDecoration: "none", borderBottom: "1px solid var(--brand)",
              paddingBottom: "1px",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-dark)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--brand)")}>
            Book a demo →
          </a>
        </div>

        {/* Product links */}
        <div>
          <p style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: "1.25rem" }}>
            Product
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {product.map(l => (
              <a key={l.label} href={l.href}
                style={{ fontFamily: SANS, fontSize: "0.875rem", color: "var(--ink-2)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Company links */}
        <div>
          <p style={{ fontFamily: SANS, fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: "1.25rem" }}>
            Company
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {company.map(l => (
              <a key={l.label} href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ fontFamily: SANS, fontSize: "0.875rem", color: "var(--ink-2)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: "min(92vw, 76rem)", margin: "0 auto",
          padding: "1.25rem 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "0.75rem",
        }}>
          <span style={{ fontFamily: SANS, fontSize: "0.75rem", color: "var(--ink-3)" }}>
            © 2026 Structure Build, Inc. All rights reserved.
          </span>
          <span style={{ fontFamily: SANS, fontSize: "0.75rem", color: "var(--ink-3)" }}>
            Built for architects.
          </span>
        </div>
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 20); return () => clearTimeout(t) }, [])

  return (
    <>
      {/* Plain div — animated transform on a parent breaks position:sticky */}
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}>
        <ScrollProgressBar />
        <Nav />
        <Hero />
        <ProblemSection />
        <Features />
        <HowItWorks />
        <MeetTheTeam />
        <ClosingCTA />
        <Footer />
      </div>
    </>
  )
}
