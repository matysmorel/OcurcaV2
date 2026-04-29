"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useLanguage } from "@/context/LanguageContext"
import type { TranslationKey } from "@/lib/translations"

const INTERESTS: { value: string; labelKey: TranslationKey }[] = [
  { value: "community-events", labelKey: "cta_interest_events" },
  { value: "eshop", labelKey: "cta_interest_eshop" },
  { value: "the-protocol", labelKey: "cta_interest_protocol" },
]

export function CommunityCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [email, setEmail] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t } = useLanguage()

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
    <section id="community" className="relative bg-[#8FC261] overflow-hidden py-24 md:py-36">
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
            <span className="block w-10 h-[2px] bg-[#262626]" />
            <span className="text-[#262626] text-xs tracking-[0.25em] uppercase font-medium">{t("cta_eyebrow")}</span>
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
            {t("cta_h2_line1")}<br />{t("cta_h2_line2")}
          </h2>

          <p className="text-[#262626]/70 text-lg mb-12 leading-relaxed max-w-xl">
            {t("cta_body")}
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
              className="flex items-center gap-3 bg-[#262626] text-[#F5F3EE] px-8 py-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8FC261] flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-medium">{t("cta_success")}</span>
            </motion.div>
          ) : (
            <>
              {/* Interest pills */}
              <div className="mb-6">
                <p className="text-[#262626] text-sm font-medium mb-3">{t("cta_interest_label")}</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ value, labelKey }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleInterest(value)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                        interests.includes(value)
                          ? "bg-[#8FC261] text-[#262626] border border-[#8FC261]"
                          : "bg-[#262626] text-[#F5F3EE] border border-[#262626] hover:border-[#262626]"
                      }`}
                    >
                      {t(labelKey)}
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
                  placeholder={t("cta_email_placeholder")}
                  required
                  className="flex-1 px-6 py-4 bg-[#1a1a1a] text-[#F5F3EE] placeholder:text-[#F5F3EE]/30 focus:outline-none focus:ring-2 focus:ring-[#262626]/30 transition-all border-0 min-w-0"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#262626] text-[#F5F3EE] font-medium hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("cta_submitting")}
                    </>
                  ) : (
                    t("cta_submit")
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
          className="text-[#262626]/60 text-sm mt-5"
        >
          {t("cta_footnote")}
        </motion.p>
      </div>
    </section>
  )
}
