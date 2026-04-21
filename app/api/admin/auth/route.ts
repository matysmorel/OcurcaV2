import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { deriveToken } from '@/lib/admin-auth'

const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60_000

function checkRate(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || rec.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (rec.count >= MAX_ATTEMPTS) return false
  rec.count++
  return true
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length, 1)
  const bufA = Buffer.alloc(maxLen)
  const bufB = Buffer.alloc(maxLen)
  bufA.write(a)
  bufB.write(b)
  return timingSafeEqual(bufA, bufB) && a.length === b.length
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRate(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const { password } = body as { password?: string }

  if (
    typeof password === 'string' &&
    timingSafeStringEqual(password, process.env.ADMIN_PASSWORD ?? '')
  ) {
    return NextResponse.json({ token: deriveToken(process.env.ADMIN_PASSWORD ?? '') })
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
