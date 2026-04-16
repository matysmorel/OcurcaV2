"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const focusAreas = [
  {
    title: "Insulin Response",
    description: "Smart formulations designed to support stable blood sugar levels and metabolic efficiency throughout your day.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    title: "Gut Microbiome",
    description: "Prebiotic and probiotic ingredients that nourish your gut flora, supporting digestion and immune function.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
        <path d="M2 12h20"/>
      </svg>
    ),
  },
  {
    title: "Circadian Rhythms",
    description: "Time-optimized nutrition that works with your body&apos;s natural cycles for peak performance and recovery.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
]

function FocusCard({ area, index }: { area: typeof focusAreas[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative bg-[#F5F3EE]/5 border border-[#F5F3EE]/10 rounded-2xl p-8 hover:bg-[#F5F3EE]/10 transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8FC261] to-[#8FC261]/50 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="w-16 h-16 rounded-xl bg-[#8FC261]/20 flex items-center justify-center mb-6 text-[#8FC261] group-hover:bg-[#8FC261] group-hover:text-[#262626] transition-all duration-300">
        {area.icon}
      </div>
      
      <h3 
        className="text-xl font-medium text-[#F5F3EE] mb-3"
        style={{ fontFamily: 'var(--font-carme)' }}
      >
        {area.title}
      </h3>
      
      <p className="text-[#F5F3EE]/70 leading-relaxed">
        {area.description}
      </p>
    </motion.div>
  )
}

export function Mission() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="mission" className="py-24 md:py-32 bg-[#262626]">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/logo-white.png"
              alt="Ocurca"
              width={160}
              height={45}
              className="h-auto"
            />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl text-[#F5F3EE] mb-6"
            style={{ fontFamily: 'var(--font-carme)' }}
          >
            <span className="text-balance">Science-backed nutrition for modern life</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#F5F3EE]/70 max-w-2xl mx-auto leading-relaxed"
          >
            We focus on three core pillars of metabolic health, combining ancestral wisdom 
            with cutting-edge research to create functional foods that actually work.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => (
            <FocusCard key={area.title} area={area} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
