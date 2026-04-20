"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

export function CommunityCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    try {
      const res = await fetch("https://formspree.io/f/xojylbvz", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setIsSubmitted(true)
        setEmail("")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="community" className="relative bg-[#8FC261] overflow-hidden py-24 md:py-36">
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
        aria-hidden
      />

      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[#262626] whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-carme)',
            fontSize: 'clamp(80px, 16vw, 200px)',
            lineHeight: 1,
            opacity: 0.06,
          }}
        >
          COMMUNITY
        </span>
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-10 h-[2px] bg-[#262626]" />
            <span className="text-[#262626] text-xs tracking-[0.25em] uppercase font-medium">Join Us</span>
          </div>

          <h2
            className="text-[#262626] mb-6"
            style={{
              fontFamily: 'var(--font-carme)',
              fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
              lineHeight: 0.93,
              letterSpacing: '-0.02em',
            }}
          >
            Be the first<br />to know.
          </h2>

          <p className="text-[#262626]/65 text-lg mb-12 leading-relaxed max-w-xl">
            Join our community for early access to new products, exclusive insights on
            metabolic health, and the latest in functional nutrition science.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row max-w-xl"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-[#262626] text-[#F5F3EE] px-8 py-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8FC261] flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-medium">Welcome to the community!</span>
            </motion.div>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-6 py-4 bg-[#262626] text-[#F5F3EE] placeholder:text-[#F5F3EE]/30 focus:outline-none focus:ring-2 focus:ring-[#F5F3EE]/20 transition-all border-0 min-w-0"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-[#F5F3EE] text-[#262626] font-medium hover:bg-[#262626] hover:text-[#F5F3EE] transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </>
          )}
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[#262626]/45 text-sm mt-5"
        >
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  )
}
