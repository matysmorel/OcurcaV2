"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F5F3EE] overflow-hidden flex flex-col">
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
        aria-hidden
      />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 pt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image src="/logo.png" alt="Ocurca" width={160} height={46} priority />
        </motion.div>

        <motion.a
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          href="#community"
          className="hidden md:flex items-center gap-2 text-sm font-medium text-[#262626] hover:text-[#8FC261] transition-colors duration-200 cursor-pointer"
        >
          Join Community
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </motion.a>
      </nav>

      {/* Main content — left anchored */}
      <div className="relative z-10 flex-1 flex items-center px-8 md:px-16 py-16 md:py-0">
        <div className="w-full max-w-[960px]">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-10 h-[2px] bg-[#8FC261]" />
            <span className="text-[#8FC261] text-xs tracking-[0.25em] uppercase font-medium">
              Ancient Wisdom meets Modern Science
            </span>
          </motion.div>

          {/* Giant headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#262626] mb-10"
            style={{
              fontFamily: 'var(--font-carme)',
              fontSize: 'clamp(3.5rem, 9.5vw, 8.5rem)',
              lineHeight: 0.93,
              letterSpacing: '-0.02em',
            }}
          >
            Functional<br />
            <span className="text-[#8FC261]">nutrition</span><br />
            designed for<br />
            how you live.
          </motion.h1>

          {/* Body + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12"
          >
            <a
              href="#community"
              className="inline-flex items-center gap-3 bg-[#262626] text-[#F5F3EE] px-8 py-4 font-medium text-base hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Join the Community
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <p className="text-[#262626]/60 text-sm leading-relaxed max-w-[240px]">
              Science-backed snacks for metabolic health, gut microbiome, and natural rhythms.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative large "O" watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute right-[-4vw] top-1/2 -translate-y-[45%] pointer-events-none select-none z-0"
        aria-hidden
      >
        <span
          className="block text-[#262626]"
          style={{
            fontFamily: 'var(--font-carme)',
            fontSize: 'clamp(280px, 52vw, 680px)',
            lineHeight: 1,
            opacity: 0.035,
          }}
        >
          O
        </span>
      </motion.div>

      {/* Green corner triangle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 right-0 pointer-events-none z-0"
        style={{
          width: 'clamp(100px, 18vw, 260px)',
          height: 'clamp(100px, 18vw, 260px)',
          background: '#8FC261',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
        aria-hidden
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-8 md:left-16 z-20 flex items-center gap-2"
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#262626]/40 rotate-90">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </motion.div>
        <span className="text-[#262626]/40 text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
