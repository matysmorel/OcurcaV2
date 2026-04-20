import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { BlogPost } from '@/lib/types'

const dataPath = path.join(process.cwd(), 'data', 'blog-posts.json')

function read(): BlogPost[] {
  try { return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) } catch { return [] }
}
function write(data: BlogPost[]) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}
function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data = read()
  const idx = data.findIndex(p => p.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[idx] = { ...data[idx], ...body, id }
  write(data)
  return NextResponse.json(data[idx])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = read()
  const filtered = data.filter(p => p.id !== id)
  if (filtered.length === data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  write(filtered)
  return NextResponse.json({ success: true })
}
