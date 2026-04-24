"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const focusAreas = [
  {
    number: "01",
    title: "Insulin Response",
    description: "Smart formulations designed to support stable blood sugar levels and metabolic efficiency throughout your day.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Gut Microbiome",
    description: "Prebiotic and probiotic ingredients that nourish your gut flora, supporting digestion and immune function.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Circadian Rhythms",
    description: "Time-optimized nutrition that works with your body&apos;s natural cycles for peak performance and recovery.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

function FocusCard({ area, index }: { area: typeof focusAreas[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-l-[3px] border-[#8FC261]/25 hover:border-[#8FC261] pl-8 py-4 transition-all duration-300"
    >
      {/* Number watermark */}
      <span
        className="absolute right-0 top-0 pointer-events-none select-none text-[#F5F3EE]"
        style={{ fontFamily: 'var(--font-carme)', fontSize: '6rem', lineHeight: 1, opacity: 0.04 }}
        aria-hidden
      >
        {area.number}
      </span>

      {/* Icon */}
      <div className="w-12 h-12 flex items-center justify-center text-[#8FC261] mb-5 border border-[#8FC261]/30 group-hover:border-[#8FC261] group-hover:bg-[#8FC261] group-hover:text-[#262626] transition-all duration-300">
        {area.icon}
      </div>

      <h3
        className="text-xl font-medium text-[#F5F3EE] mb-3"
        style={{ fontFamily: 'var(--font-carme)' }}
      >
        {area.title}
      </h3>

      <p className="text-[#F5F3EE]/60 leading-relaxed text-sm">
        {area.description}
      </p>
    </motion.div>
  )
}

export function Mission() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section id="mission" className="relative py-24 md:py-36 bg-[#262626] overflow-hidden">
      {/* Background watermark */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[#F5F3EE] whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-carme)',
            fontSize: 'clamp(100px, 18vw, 240px)',
            lineHeight: 1,
            opacity: 0.025,
          }}
        >
          SCIENCE BACKED
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16">
        <div ref={sectionRef} className="grid md:grid-cols-[1fr,2fr] gap-16 md:gap-24 items-start">

          {/* Left: Sticky header */}
          <div className="md:sticky md:top-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.7 }}
              className="mb-8"
            >
              <Image src="/logo-white.png" alt="Ocurca" width={120} height={34} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="block w-8 h-[2px] bg-[#8FC261]" />
              <span className="text-[#8FC261] text-xs tracking-[0.2em] uppercase">Our Mission</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#F5F3EE] mb-6"
              style={{
                fontFamily: 'var(--font-carme)',
                fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
                lineHeight: 1.1,
              }}
            >
              Science-backed nutrition for modern life
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#F5F3EE]/55 leading-relaxed text-sm"
            >
              Three core pillars of metabolic health — combining ancestral wisdom with cutting-edge research.
            </motion.p>
          </div>

          {/* Right: Cards */}
          <div className="space-y-12">
            {focusAreas.map((area, index) => (
              <FocusCard key={area.title} area={area} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8FC261] border border-[#8FC261] px-5 py-2.5 hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-200 cursor-pointer"
          >
            Stay Informed
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
