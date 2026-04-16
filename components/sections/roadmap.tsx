"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const phases = [
  {
    number: "01",
    title: "Community First",
    description: "Building a tribe of health-conscious individuals who believe in functional nutrition and metabolic wellness.",
    status: "active",
  },
  {
    number: "02",
    title: "E-Shop Launch",
    description: "Curated online store featuring our first line of science-backed functional snacks and supplements.",
    status: "upcoming",
  },
  {
    number: "03",
    title: "Digital Platform",
    description: "Personalized nutrition recommendations powered by data, connecting your goals with optimal products.",
    status: "upcoming",
  },
  {
    number: "04",
    title: "Physical Presence",
    description: "Smart vending machines and pop-up locations bringing healthy choices to where you live and work.",
    status: "upcoming",
  },
]

function PhaseCard({ phase, index }: { phase: typeof phases[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      <div className="flex items-start gap-6">
        {/* Number circle */}
        <div 
          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium ${
            phase.status === "active" 
              ? "bg-[#8FC261] text-[#262626]" 
              : "bg-[#262626]/10 text-[#262626]/60 border border-[#262626]/20"
          }`}
          style={{ fontFamily: 'var(--font-carme)' }}
        >
          {phase.number}
        </div>
        
        {/* Content */}
        <div className="flex-1 pt-2">
          <div className="flex items-center gap-3 mb-2">
            <h3 
              className={`text-xl md:text-2xl ${phase.status === "active" ? "text-[#8FC261]" : "text-[#262626]"}`}
              style={{ fontFamily: 'var(--font-carme)' }}
            >
              {phase.title}
            </h3>
            {phase.status === "active" && (
              <span className="px-3 py-1 text-xs bg-[#8FC261]/20 text-[#262626] rounded-full font-medium">
                Current Phase
              </span>
            )}
          </div>
          <p className="text-[#262626]/60 leading-relaxed max-w-md">
            {phase.description}
          </p>
        </div>
      </div>
      
      {/* Connecting line */}
      {index < phases.length - 1 && (
        <div className="absolute left-8 top-16 w-[2px] h-20 bg-gradient-to-b from-[#262626]/20 to-transparent" />
      )}
    </motion.div>
  )
}

export function Roadmap() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="roadmap" className="py-24 md:py-32 bg-[#F5F3EE]">
      <div className="max-w-4xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[#8FC261] text-sm tracking-widest uppercase mb-4"
          >
            Our Vision
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl text-[#262626] mb-6"
            style={{ fontFamily: 'var(--font-carme)' }}
          >
            <span className="text-balance">Building the future of functional nutrition</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#262626]/60 max-w-2xl mx-auto leading-relaxed"
          >
            From community to commerce, we&apos;re on a mission to make science-backed 
            nutrition accessible everywhere.
          </motion.p>
        </div>

        <div className="space-y-12">
          {phases.map((phase, index) => (
            <PhaseCard key={phase.number} phase={phase} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
