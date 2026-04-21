import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { BlogPost } from '@/lib/types'
import { isAdminToken, isSafeUrl } from '@/lib/admin-auth'

const dataPath = path.join(process.cwd(), 'data', 'blog-posts.json')

function read(): BlogPost[] {
  try { return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) } catch { return [] }
}
function write(data: BlogPost[]) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
}

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(req: NextRequest) {
  if (!isAdminToken(req.headers.get('x-admin-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  if (body.link && !isSafeUrl(body.link)) {
    return NextResponse.json({ error: 'Invalid URL — must be http or https' }, { status: 400 })
  }
  const data = read()
  const item: BlogPost = {
    id: randomUUID(),
    title: String(body.title ?? '').slice(0, 200),
    description: String(body.description ?? '').slice(0, 1000),
    link: body.link,
    image: String(body.image ?? '').slice(0, 500),
    published: Boolean(body.published),
    createdAt: new Date().toISOString(),
  }
  data.push(item)
  write(data)
  return NextResponse.json(item, { status: 201 })
}
