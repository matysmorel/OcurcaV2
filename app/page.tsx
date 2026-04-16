import { Hero } from "@/components/sections/hero"
import { Mission } from "@/components/sections/mission"
import { Roadmap } from "@/components/sections/roadmap"
import { CommunityCTA } from "@/components/sections/community-cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Mission />
      <Roadmap />
      <CommunityCTA />
      <Footer />
    </main>
  )
}
