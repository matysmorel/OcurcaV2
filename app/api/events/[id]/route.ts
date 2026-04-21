import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { Event } from '@/lib/types'
import { isAdminToken, isSafeUrl } from '@/lib/admin-auth'

const dataPath = path.join(process.cwd(), 'data', 'events.json')

function read(): Event[] {
  try { return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) } catch { return [] }
}
function write(data: Event[]) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminToken(req.headers.get('x-admin-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  if (body.link && !isSafeUrl(body.link)) {
    return NextResponse.json({ error: 'Invalid URL — must be http or https' }, { status: 400 })
  }
  const data = read()
  const idx = data.findIndex(e => e.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[idx] = {
    ...data[idx],
    title: String(body.title ?? data[idx].title).slice(0, 200),
    description: String(body.description ?? data[idx].description).slice(0, 1000),
    date: String(body.date ?? data[idx].date),
    link: body.link ?? data[idx].link,
    image: String(body.image ?? data[idx].image).slice(0, 500),
    published: Boolean(body.published),
    id,
  }
  write(data)
  return NextResponse.json(data[idx])
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminToken(req.headers.get('x-admin-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const data = read()
  const filtered = data.filter(e => e.id !== id)
  if (filtered.length === data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  write(filtered)
  return NextResponse.json({ success: true })
}
