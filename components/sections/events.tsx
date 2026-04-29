"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import type { Event } from "@/lib/types"
import { useLanguage } from "@/context/LanguageContext"

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-[#262626]/10 overflow-hidden">
      <div className="bg-[#e8e6e1] h-48 w-full" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-[#e8e6e1] rounded w-3/4" />
        <div className="h-4 bg-[#e8e6e1] rounded w-full" />
        <div className="h-4 bg-[#e8e6e1] rounded w-5/6" />
        <div className="h-9 bg-[#e8e6e1] rounded w-28 mt-2" />
      </div>
    </div>
  )
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const { t, lang } = useLanguage()

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#262626]/10 overflow-hidden group flex flex-col"
    >
      <div className="relative h-48 bg-[#e8e6e1] overflow-hidden flex-shrink-0">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#262626]/20">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-[#8FC261] text-xs tracking-[0.15em] uppercase font-medium mb-2">
          {new Date(event.created_at).toLocaleDateString(t("date_locale"), { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h3 className="text-[#262626] text-xl mb-3 font-medium" style={{ fontFamily: "var(--font-carme)" }}>
          {event.title}
        </h3>
        <p className="text-[#262626]/60 text-sm leading-relaxed mb-6 flex-1">
          {event.description}
        </p>
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#262626] border border-[#262626] px-5 py-2.5 hover:bg-[#262626] hover:text-[#F5F3EE] transition-all duration-200 cursor-pointer self-start"
        >
          {t("events_learn_more")}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.article>
  )
}

export function Events() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setEvents(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="events" className="py-24 md:py-32 bg-[#F5F3EE]">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block w-10 h-[2px] bg-[#8FC261]" />
            <span className="text-[#8FC261] text-xs tracking-[0.25em] uppercase font-medium">{t("events_eyebrow")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#262626]"
            style={{
              fontFamily: "var(--font-carme)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.015em",
            }}
          >
            {t("events_heading")}
          </motion.h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-20 text-center"
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-[#262626]/15">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8FC261]">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <p className="text-[#262626]/50 text-lg" style={{ fontFamily: "var(--font-carme)" }}>
              {t("events_empty")}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8FC261] border border-[#8FC261] px-5 py-2.5 hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-200 cursor-pointer"
          >
            {t("events_cta")}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
