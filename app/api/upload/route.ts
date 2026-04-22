import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminToken } from '@/lib/admin-auth'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  if (!isAdminToken(req.headers.get('x-admin-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File must be under 5 MB' }, { status: 400 })
  }

  const rawExt = '.' + file.name.split('.').pop()?.toLowerCase()
  const ext = ALLOWED_EXTS.has(rawExt) ? rawExt : '.jpg'
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${ext}`

  const bytes = await file.arrayBuffer()
  const { error } = await supabaseAdmin()
    .storage
    .from('media')
    .upload(filename, bytes, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin()
    .storage
    .from('media')
    .getPublicUrl(filename)

  return NextResponse.json({ url: publicUrl })
}
