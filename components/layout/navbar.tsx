"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import type { Language } from "@/lib/translations"

function PagesDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-[#262626] hover:text-[#8FC261] transition-colors duration-200 cursor-pointer"
      >
        {t("nav_pages")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 w-52 bg-[#F5F3EE] border border-[#262626]/10 shadow-lg z-50"
          >
            <Link
              href="/events"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-sm text-[#262626] hover:text-[#8FC261] hover:bg-[#262626]/5 transition-colors duration-150"
            >
              {t("nav_community_events")}
            </Link>
            <Link
              href="/protocol"
              onClick={() => setOpen(false)}
              className="block px-5 py-3 text-sm text-[#262626] hover:text-[#8FC261] hover:bg-[#262626]/5 transition-colors duration-150 border-t border-[#262626]/10"
            >
              {t("nav_the_protocol")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  const options: Language[] = ["en", "cs"]

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {options.map((option, i) => (
        <span key={option} className="flex items-center gap-1">
          {i > 0 && <span className="text-[#262626]/25">|</span>}
          <button
            onClick={() => setLang(option)}
            className={`cursor-pointer transition-colors duration-200 uppercase tracking-wide ${
              lang === option
                ? "text-[#262626]"
                : "text-[#262626]/40 hover:text-[#262626]/70"
            }`}
          >
            {option}
          </button>
        </span>
      ))}
    </div>
  )
}

export function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-8 md:px-16 pt-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/">
          <Image src="/logo.png" alt="Ocurca" width={160} height={46} priority />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-6"
      >
        <PagesDropdown />
        <LanguageToggle />
      </motion.div>
    </nav>
  )
}
