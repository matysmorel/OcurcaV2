"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F5F3EE] flex items-center justify-center overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#8FC261]/15 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-[#8FC261]/10 blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/logo.png"
            alt="Ocurca"
            width={280}
            height={80}
            className="mx-auto mb-8"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#8FC261] text-lg md:text-xl tracking-wide mb-6 font-medium"
        >
          Ancient Wisdom meets Modern Science
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[#262626] text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 font-[var(--font-carme)]"
          style={{ fontFamily: 'var(--font-carme)' }}
        >
          <span className="text-balance">Functional nutrition designed for the way you actually live</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[#262626]/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          We&apos;re building a new category of smart snacks that support your metabolic health, 
          gut microbiome, and natural rhythms—backed by science, not trends.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a
            href="#community"
            className="inline-flex items-center gap-2 bg-[#262626] text-[#F5F3EE] px-8 py-4 rounded-full font-medium text-lg hover:bg-[#262626]/90 transition-all duration-300 hover:scale-105"
          >
            Join the Community
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-[#262626]/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-[#8FC261] rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
