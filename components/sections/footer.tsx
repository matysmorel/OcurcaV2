"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"
import type { TranslationKey } from "@/lib/translations"

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733-16z"/>
        <path d="M4 20l6.768-6.768M15.232 10.768L20 4"/>
      </svg>
    ),
  },
]

const footerLinkConfig: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "footer_link_mission", href: "#mission" },
  { labelKey: "footer_link_roadmap", href: "#roadmap" },
  { labelKey: "footer_link_community", href: "#community" },
]

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const { t } = useLanguage()

  return (
    <footer className="bg-[#262626] py-16">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12"
        >
          <Image
            src="/logo-white.png"
            alt="Ocurca"
            width={140}
            height={40}
            className="h-auto"
          />

          <nav className="flex items-center gap-8">
            {footerLinkConfig.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="text-[#F5F3EE]/70 hover:text-[#8FC261] transition-colors duration-200"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="w-10 h-10 rounded-full bg-[#F5F3EE]/10 flex items-center justify-center text-[#F5F3EE]/70 hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-8 border-t border-[#F5F3EE]/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-[#F5F3EE]/50 text-sm">
            &copy; {new Date().getFullYear()} Ocurca. {t("footer_rights")}
          </p>

          <p className="text-[#F5F3EE]/50 text-sm">
            {t("footer_tagline")}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
