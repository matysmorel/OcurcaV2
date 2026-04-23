"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"

type CarouselItem = {
  id: string
  title: string
  description: string
  link: string
  image_url: string | null
  created_at: string
  type: "EVENT" | "ARTICLE"
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-[#262626]/6 overflow-hidden">
      <div className="h-40 bg-[#262626]/8" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-[#262626]/8 rounded w-14" />
        <div className="h-5 bg-[#262626]/10 rounded w-3/4" />
        <div className="h-4 bg-[#262626]/6 rounded w-full" />
        <div className="h-4 bg-[#262626]/6 rounded w-5/6" />
      </div>
    </div>
  )
}

function HeroCarousel({ items, loading }: { items: CarouselItem[]; loading: boolean }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || isPaused || items.length <= 1) return
    const timer = setInterval(() => emblaApi.scrollNext(), 4000)
    return () => clearInterval(timer)
  }, [emblaApi, isPaused, items.length])

  if (loading || items.length === 0) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] min-w-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#262626] overflow-hidden"
              >
                <div className="relative h-44 bg-[#F5F3EE]/5 overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#F5F3EE]/15">
                        {item.type === "EVENT" ? (
                          <>
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                          </>
                        ) : (
                          <>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </>
                        )}
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 ${
                      item.type === "EVENT"
                        ? "bg-[#8FC261] text-[#262626]"
                        : "bg-[#F5F3EE]/15 text-[#F5F3EE]"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3
                    className="text-[#F5F3EE] font-medium mb-2 text-lg leading-tight"
                    style={{ fontFamily: "var(--font-carme)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#F5F3EE]/50 text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === selectedIndex ? "w-6 bg-[#8FC261]" : "w-1.5 bg-[#262626]/25"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Hero() {
  const [items, setItems] = useState<CarouselItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase
        .from("events")
        .select("id, title, description, link, image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("blog_posts")
        .select("id, title, description, link, image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(5),
    ]).then(([eventsRes, postsRes]) => {
      const combined: CarouselItem[] = [
        ...(eventsRes.data ?? []).map(e => ({ ...e, type: "EVENT" as const })),
        ...(postsRes.data ?? []).map(p => ({ ...p, type: "ARTICLE" as const })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
      setItems(combined)
      setLoading(false)
    })
  }, [])

  return (
    <section className="relative min-h-screen bg-[#F5F3EE] overflow-hidden flex flex-col">
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
        aria-hidden
      />

      <Navbar />

      {/* Two-column layout: headline left, carousel right */}
      <div className="relative z-10 flex-1 flex items-center px-8 md:px-16 py-16 md:py-20">
        <div className="w-full grid md:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
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

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#262626] mb-10"
              style={{
                fontFamily: "var(--font-carme)",
                fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
                lineHeight: 0.93,
                letterSpacing: "-0.02em",
              }}
            >
              Functional<br />
              <span className="text-[#8FC261]">nutrition</span><br />
              designed for<br />
              how you live.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <a
                href="#events"
                className="inline-flex items-center gap-3 bg-[#262626] text-[#F5F3EE] px-8 py-4 font-medium text-base hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Join the Community
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>

              <a
                href="#contact-form"
                className="inline-flex items-center gap-3 border border-[#8FC261] text-[#8FC261] px-8 py-4 font-medium text-base hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Keep in Touch
              </a>
            </motion.div>
          </div>

          {/* Right: carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroCarousel items={items} loading={loading} />
          </motion.div>
        </div>
      </div>

      {/* Green corner accent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 right-0 pointer-events-none z-0"
        style={{
          width: "clamp(80px, 10vw, 160px)",
          height: "clamp(80px, 10vw, 160px)",
          background: "#8FC261",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
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
