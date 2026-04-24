"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

const INTERESTS = [
  { value: "community-events", label: "Community Events" },
  { value: "eshop", label: "E-Shop" },
  { value: "the-protocol", label: "The Protocol" },
]

export function CommunityCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [email, setEmail] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const toggleInterest = (value: string) => {
    setInterests(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("subscribers")
        .upsert({ email, interests }, { onConflict: "email" })
      if (!error) {
        setIsSubmitted(true)
        setEmail("")
        setInterests([])
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="community" className="relative bg-[#0a0a0a] overflow-hidden py-24 md:py-36">
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[#F5F3EE] whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-carme)',
            fontSize: 'clamp(80px, 16vw, 200px)',
            lineHeight: 1,
            opacity: 0.03,
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
            <span className="block w-10 h-[2px] bg-[#8FC261]" />
            <span className="text-[#8FC261] text-xs tracking-[0.25em] uppercase font-medium">Join Us</span>
          </div>

          <h2
            className="text-[#F5F3EE] mb-6"
            style={{
              fontFamily: 'var(--font-carme)',
              fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
              lineHeight: 0.93,
              letterSpacing: '-0.02em',
            }}
          >
            Be the first<br />to know.
          </h2>

          <p className="text-[#F5F3EE]/65 text-lg mb-12 leading-relaxed max-w-xl">
            Join our community for early access to new products, exclusive insights on
            metabolic health, and the latest in functional nutrition science.
          </p>
        </motion.div>

        <motion.form
          id="contact-form"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="max-w-xl"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-[#1a1a1a] text-[#F5F3EE] px-8 py-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8FC261] flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-medium">Welcome to the community!</span>
            </motion.div>
          ) : (
            <>
              {/* Interest pills */}
              <div className="mb-6">
                <p className="text-[#F5F3EE] text-sm font-medium mb-3">I'm interested in</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleInterest(value)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        interests.includes(value)
                          ? "bg-[#8FC261] text-[#262626] border border-[#8FC261]"
                          : "bg-transparent text-[#F5F3EE] border border-[#F5F3EE]/25 hover:border-[#F5F3EE]/60"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email + submit */}
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-6 py-4 bg-[#1a1a1a] text-[#F5F3EE] placeholder:text-[#F5F3EE]/30 focus:outline-none focus:ring-2 focus:ring-[#F5F3EE]/20 transition-all border-0 min-w-0"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#F5F3EE] text-[#262626] font-medium hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
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
              </div>
            </>
          )}
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[#F5F3EE]/45 text-sm mt-5"
        >
          No spam, ever. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  )
}
