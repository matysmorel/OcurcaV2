"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useLanguage } from "@/context/LanguageContext"
import type { TranslationKey } from "@/lib/translations"

const phaseConfig = [
  {
    number: "01",
    titleKey: "roadmap_phase1_title" as TranslationKey,
    descKey: "roadmap_phase1_desc" as TranslationKey,
    status: "active",
  },
  {
    number: "02",
    titleKey: "roadmap_phase2_title" as TranslationKey,
    descKey: "roadmap_phase2_desc" as TranslationKey,
    status: "upcoming",
  },
  {
    number: "03",
    titleKey: "roadmap_phase3_title" as TranslationKey,
    descKey: "roadmap_phase3_desc" as TranslationKey,
    status: "upcoming",
  },
  {
    number: "04",
    titleKey: "roadmap_phase4_title" as TranslationKey,
    descKey: "roadmap_phase4_desc" as TranslationKey,
    status: "upcoming",
  },
]

function PhaseCard({ phase, index }: { phase: typeof phaseConfig[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const isActive = phase.status === "active"
  const { t } = useLanguage()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden border-b border-[#262626]/10 ${isActive ? 'bg-[#8FC261]' : ''}`}
    >
      <span
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontFamily: 'var(--font-carme)',
          fontSize: 'clamp(5rem, 14vw, 11rem)',
          lineHeight: 1,
          opacity: isActive ? 0.09 : 0.04,
          color: '#262626',
        }}
        aria-hidden
      >
        {phase.number}
      </span>

      <div className="relative z-10 flex items-start gap-6 md:gap-10 px-8 md:px-10 py-8 md:py-10">
        <div
          className={`flex-shrink-0 text-sm font-medium tracking-widest pt-1 ${isActive ? 'text-[#262626]/60' : 'text-[#262626]/30'}`}
          style={{ fontFamily: 'var(--font-carme)' }}
        >
          {phase.number}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <h3
              className="font-medium text-[#262626]"
              style={{
                fontFamily: 'var(--font-carme)',
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              }}
            >
              {t(phase.titleKey)}
            </h3>
            {isActive && (
              <span className="px-3 py-1 text-xs bg-[#262626] text-[#F5F3EE] font-medium tracking-[0.15em] uppercase">
                {t("roadmap_now")}
              </span>
            )}
          </div>
          <p className={`leading-relaxed max-w-lg text-sm md:text-base ${isActive ? 'text-[#262626]/65' : 'text-[#262626]/45'}`}>
            {t(phase.descKey)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function Roadmap() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  const { t } = useLanguage()

  return (
    <section id="roadmap" className="py-24 md:py-36 bg-[#F5F3EE]">
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block w-10 h-[2px] bg-[#8FC261]" />
            <span className="text-[#8FC261] text-xs tracking-[0.25em] uppercase font-medium">{t("roadmap_eyebrow")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#262626]"
            style={{
              fontFamily: 'var(--font-carme)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.015em',
            }}
          >
            {t("roadmap_h2_line1")}<br />{t("roadmap_h2_line2")}
          </motion.h2>
        </div>

        <div className="border-t border-[#262626]/10">
          {phaseConfig.map((phase, index) => (
            <PhaseCard key={phase.number} phase={phase} index={index} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8FC261] border border-[#8FC261] px-5 py-2.5 hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-200 cursor-pointer"
          >
            {t("roadmap_cta")}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
