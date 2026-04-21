import { createHmac, timingSafeEqual } from 'crypto'

export function deriveToken(password: string): string {
  return createHmac('sha256', password).update('ocurca-admin-v1').digest('hex')
}

export function isAdminToken(token: string | null): boolean {
  if (!token || token.length !== 64) return false
  const expected = deriveToken(process.env.ADMIN_PASSWORD ?? '')
  try {
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}
