import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
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

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data = read()
  const item: BlogPost = {
    id: randomUUID(),
    title: body.title,
    description: body.description,
    link: body.link,
    image: body.image ?? '',
    published: body.published ?? false,
    createdAt: new Date().toISOString(),
  }
  data.push(item)
  write(data)
  return NextResponse.json(item, { status: 201 })
}
