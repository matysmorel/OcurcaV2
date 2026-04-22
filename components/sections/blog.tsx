"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import type { BlogPost } from "@/lib/types"

function SkeletonCard() {
  return (
    <div className="animate-pulse border-l-[3px] border-[#8FC261]/15 pl-8 py-4">
      <div className="bg-[#F5F3EE]/8 h-44 w-full mb-4" />
      <div className="h-5 bg-[#F5F3EE]/10 rounded w-3/4 mb-2" />
      <div className="h-4 bg-[#F5F3EE]/8 rounded w-full mb-1" />
      <div className="h-4 bg-[#F5F3EE]/8 rounded w-5/6 mb-5" />
      <div className="h-9 bg-[#F5F3EE]/8 rounded w-28" />
    </div>
  )
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group border-l-[3px] border-[#8FC261]/25 hover:border-[#8FC261] pl-8 py-4 transition-all duration-300 flex flex-col gap-4"
    >
      <div className="relative h-44 bg-[#F5F3EE]/5 overflow-hidden flex-shrink-0">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#F5F3EE]/15">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <h3
          className="text-[#F5F3EE] text-xl font-medium"
          style={{ fontFamily: "var(--font-carme)" }}
        >
          {post.title}
        </h3>
        <p className="text-[#F5F3EE]/55 text-sm leading-relaxed flex-1">
          {post.description}
        </p>
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#8FC261] border border-[#8FC261]/40 px-5 py-2.5 hover:bg-[#8FC261] hover:text-[#262626] hover:border-[#8FC261] transition-all duration-200 cursor-pointer self-start"
        >
          Read More
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </motion.article>
  )
}

export function Blog() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="blog" className="relative py-24 md:py-32 bg-[#262626] overflow-hidden">
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[#F5F3EE] whitespace-nowrap"
          style={{
            fontFamily: "var(--font-carme)",
            fontSize: "clamp(100px, 18vw, 240px)",
            lineHeight: 1,
            opacity: 0.025,
          }}
        >
          THE PROTOCOL
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="block w-10 h-[2px] bg-[#8FC261]" />
            <span className="text-[#8FC261] text-xs tracking-[0.25em] uppercase font-medium">Knowledge</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[#F5F3EE]"
            style={{
              fontFamily: "var(--font-carme)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.015em",
            }}
          >
            The Protocol
          </motion.h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-20 text-center"
          >
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-[#F5F3EE]/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#8FC261]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-[#F5F3EE]/50 text-lg" style={{ fontFamily: "var(--font-carme)" }}>
              First articles coming soon
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
