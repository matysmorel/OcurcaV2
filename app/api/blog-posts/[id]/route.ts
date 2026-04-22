import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminToken, isSafeUrl } from '@/lib/admin-auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminToken(req.headers.get('x-admin-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  if (body.link && !isSafeUrl(body.link)) {
    return NextResponse.json({ error: 'Invalid URL — must be http or https' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin()
    .from('blog_posts')
    .update({
      title: String(body.title ?? '').slice(0, 200),
      description: String(body.description ?? '').slice(0, 1000),
      link: body.link,
      image_url: body.image_url ? String(body.image_url).slice(0, 500) : null,
      published: Boolean(body.published),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminToken(req.headers.get('x-admin-key'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const { error } = await supabaseAdmin()
    .from('blog_posts')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
