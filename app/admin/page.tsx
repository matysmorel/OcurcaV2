"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import type { Event, BlogPost } from "@/lib/types"

// ─── helpers ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "ocurca_admin_key"

function adminHeaders(): HeadersInit {
  const key = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) ?? "") : ""
  return { "Content-Type": "application/json", "x-admin-key": key }
}

async function uploadFile(file: File): Promise<string> {
  const key = localStorage.getItem(STORAGE_KEY) ?? ""
  const fd = new FormData()
  fd.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-key": key }, body: fd })
  if (!res.ok) throw new Error("Upload failed")
  const data = await res.json()
  return data.url as string
}

// ─── types ──────────────────────────────────────────────────────────────────

type Tab = "events" | "blog"
type FormMode = "add" | "edit"

interface FormState {
  title: string
  description: string
  date: string
  link: string
  image: string
  published: boolean
}

const emptyForm = (): FormState => ({
  title: "", description: "", date: "", link: "", image: "", published: false,
})

// ─── LoginPage ──────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (key: string) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        const { token } = await res.json()
        localStorage.setItem(STORAGE_KEY, token)
        onLogin(token)
      } else if (res.status === 429) {
        setError("Too many attempts. Please wait 15 minutes.")
      } else {
        setError("Invalid password. Please try again.")
      }
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Ocurca" width={140} height={40} />
        </div>

        <div className="bg-white border border-[#262626]/10 p-8">
          <h1
            className="text-[#262626] text-2xl mb-1"
            style={{ fontFamily: "var(--font-carme)" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-[#262626]/50 text-sm mb-8">Sign in to manage content</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#262626]/60 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ocurca.com"
                className="w-full px-4 py-3 border border-[#262626]/20 bg-[#F5F3EE] text-[#262626] placeholder:text-[#262626]/30 focus:outline-none focus:border-[#8FC261] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-[#262626]/60 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-[#262626]/20 bg-[#F5F3EE] text-[#262626] placeholder:text-[#262626]/30 focus:outline-none focus:border-[#8FC261] transition-colors text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#262626] text-[#F5F3EE] text-sm font-medium hover:bg-[#8FC261] hover:text-[#262626] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── ConfirmDialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#262626]/60 px-4">
      <div className="bg-white border border-[#262626]/10 p-6 max-w-sm w-full">
        <h3 className="text-[#262626] font-medium mb-2" style={{ fontFamily: "var(--font-carme)" }}>
          Delete item
        </h3>
        <p className="text-[#262626]/60 text-sm mb-6">
          Are you sure you want to delete <strong className="text-[#262626]">{title}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm border border-[#262626]/20 text-[#262626]/70 hover:border-[#262626] hover:text-[#262626] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-sm bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ItemForm ────────────────────────────────────────────────────────────────

function ItemForm({
  mode,
  tab,
  initialData,
  onClose,
  onSaved,
}: {
  mode: FormMode
  tab: Tab
  initialData?: FormState & { id?: string }
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormState>(initialData ?? emptyForm())
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)
  const [imageMode, setImageMode] = useState<"url" | "upload">("url")
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }))

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.title.trim()) e.title = "Title is required"
    if (!form.description.trim()) e.description = "Description is required"
    if (!form.link.trim()) e.link = "Link is required"
    return e
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      set("image", url)
      toast.success("Image uploaded")
    } catch {
      toast.error("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSaving(true)

    const endpoint = tab === "events" ? "/api/events" : "/api/blog-posts"
    const url = mode === "edit" && initialData?.id ? `${endpoint}/${initialData.id}` : endpoint
    const method = mode === "edit" ? "PUT" : "POST"

    try {
      const res = await fetch(url, { method, headers: adminHeaders(), body: JSON.stringify(form) })
      if (res.ok) {
        toast.success(mode === "add" ? "Item created" : "Item updated")
        onSaved()
        onClose()
      } else {
        toast.error("Failed to save item")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setSaving(false)
    }
  }

  const fieldClass = (err?: string) =>
    `w-full px-4 py-3 border ${err ? "border-red-400" : "border-[#262626]/20"} bg-[#F5F3EE] text-[#262626] placeholder:text-[#262626]/30 focus:outline-none focus:border-[#8FC261] transition-colors text-sm`

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-[#262626]/60 overflow-y-auto py-10 px-4">
      <div className="bg-white border border-[#262626]/10 w-full max-w-lg my-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626]/10">
          <h2 className="text-[#262626] font-medium" style={{ fontFamily: "var(--font-carme)" }}>
            {mode === "add" ? "Add new" : "Edit"} {tab === "events" ? "event" : "blog post"}
          </h2>
          <button onClick={onClose} className="text-[#262626]/40 hover:text-[#262626] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#262626]/60 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Enter title"
              className={fieldClass(errors.title)}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#262626]/60 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Short description"
              rows={3}
              className={`${fieldClass(errors.description)} resize-none`}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {tab === "events" && (
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#262626]/60 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
                className={fieldClass()}
              />
            </div>
          )}

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#262626]/60 mb-1.5">Link / URL *</label>
            <input
              type="url"
              value={form.link}
              onChange={e => set("link", e.target.value)}
              placeholder="https://"
              className={fieldClass(errors.link)}
            />
            {errors.link && <p className="text-red-400 text-xs mt-1">{errors.link}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs tracking-widest uppercase text-[#262626]/60">Image</label>
              <div className="flex gap-1">
                {(["url", "upload"] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setImageMode(m)}
                    className={`text-xs px-2.5 py-1 transition-colors cursor-pointer ${imageMode === m ? "bg-[#262626] text-[#F5F3EE]" : "bg-[#F5F3EE] border border-[#262626]/20 text-[#262626]/60 hover:border-[#262626]"}`}
                  >
                    {m === "url" ? "URL" : "Upload"}
                  </button>
                ))}
              </div>
            </div>
            {imageMode === "url" ? (
              <input
                type="text"
                value={form.image}
                onChange={e => set("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={fieldClass()}
              />
            ) : (
              <div className="flex items-center gap-3">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2.5 text-sm border border-[#262626]/20 text-[#262626]/70 hover:border-[#262626] hover:text-[#262626] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : "Choose file"}
                </button>
                {form.image && <span className="text-xs text-[#8FC261] truncate max-w-[180px]">{form.image}</span>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.published}
              onClick={() => set("published", !form.published)}
              className={`relative w-10 h-5 transition-colors duration-200 cursor-pointer flex-shrink-0 ${form.published ? "bg-[#8FC261]" : "bg-[#262626]/20"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white transition-transform duration-200 ${form.published ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className="text-sm text-[#262626]/70">
              {form.published ? "Published — visible on site" : "Draft — hidden from site"}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm border border-[#262626]/20 text-[#262626]/70 hover:border-[#262626] hover:text-[#262626] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 text-sm bg-[#262626] text-[#F5F3EE] hover:bg-[#8FC261] hover:text-[#262626] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── DataTable ────────────────────────────────────────────────────────────────

function DataTable<T extends { id: string; title: string; published: boolean; createdAt: string } & Record<string, unknown>>({
  items,
  tab,
  onEdit,
  onDelete,
}: {
  items: T[]
  tab: Tab
  onEdit: (item: T) => void
  onDelete: (item: T) => void
}) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-[#262626]/15">
        <p className="text-[#262626]/40 text-sm">No items yet — click <strong>Add New</strong> to create one.</p>
      </div>
    )
  }

  return (
    <div className="border border-[#262626]/10 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#262626]/10 bg-[#F5F3EE]/50">
            <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#262626]/50 font-medium">Title</th>
            {tab === "events" && <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#262626]/50 font-medium">Date</th>}
            <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#262626]/50 font-medium">Status</th>
            <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#262626]/50 font-medium">Created</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} className={`border-b border-[#262626]/8 hover:bg-[#F5F3EE]/30 transition-colors ${i % 2 === 0 ? "" : "bg-[#F5F3EE]/20"}`}>
              <td className="px-4 py-3 font-medium text-[#262626] max-w-[200px] truncate">{item.title}</td>
              {tab === "events" && (
                <td className="px-4 py-3 text-[#262626]/60">
                  {item.date ? new Date(item.date as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </td>
              )}
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${item.published ? "bg-[#8FC261]/20 text-[#4a8025]" : "bg-[#262626]/8 text-[#262626]/50"}`}>
                  {item.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3 text-[#262626]/50">
                {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-[#262626]/40 hover:text-[#262626] transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-[#262626]/40 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("events")
  const [events, setEvents] = useState<Event[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>("add")
  const [editingItem, setEditingItem] = useState<(FormState & { id: string }) | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ev, bp] = await Promise.all([
        fetch("/api/events", { headers: adminHeaders() }).then(r => r.json()),
        fetch("/api/blog-posts", { headers: adminHeaders() }).then(r => r.json()),
      ])
      setEvents(ev)
      setBlogPosts(bp)
    } catch {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openAdd = () => {
    setEditingItem(null)
    setFormMode("add")
    setFormOpen(true)
  }

  const openEdit = (item: Event | BlogPost) => {
    setEditingItem({
      id: item.id,
      title: item.title,
      description: item.description,
      date: (item as Event).date ?? "",
      link: item.link,
      image: item.image,
      published: item.published,
    })
    setFormMode("edit")
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    const endpoint = tab === "events" ? "/api/events" : "/api/blog-posts"
    try {
      const res = await fetch(`${endpoint}/${deleteTarget.id}`, { method: "DELETE", headers: adminHeaders() })
      if (res.ok) {
        toast.success("Item deleted")
        setDeleteTarget(null)
        fetchData()
      } else {
        toast.error("Delete failed")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setDeleting(false)
    }
  }

  const currentItems = tab === "events" ? events : blogPosts

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <header className="bg-white border-b border-[#262626]/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Ocurca" width={110} height={32} />
            <span className="text-[#262626]/30 text-sm hidden sm:block">|</span>
            <span className="text-[#262626]/60 text-sm hidden sm:block">Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-[#262626]/50 hover:text-[#262626] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-1">
            {(["events", "blog"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${tab === t ? "bg-[#262626] text-[#F5F3EE]" : "bg-white border border-[#262626]/20 text-[#262626]/60 hover:border-[#262626] hover:text-[#262626]"}`}
              >
                {t === "events" ? "Events" : "Blog Posts"}
              </button>
            ))}
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-[#8FC261] text-[#262626] font-medium hover:bg-[#7aad50] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Add New
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <svg className="animate-spin h-6 w-6 text-[#8FC261] mx-auto" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <DataTable
            items={currentItems}
            tab={tab}
            onEdit={openEdit}
            onDelete={item => setDeleteTarget({ id: item.id, title: item.title })}
          />
        )}
      </main>

      {formOpen && (
        <ItemForm
          mode={formMode}
          tab={tab}
          initialData={editingItem ?? undefined}
          onClose={() => setFormOpen(false)}
          onSaved={fetchData}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}

// ─── Page entry ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const key = localStorage.getItem(STORAGE_KEY)
    setAuthenticated(!!key)
  }, [])

  const handleLogin = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthenticated(false)
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
        <svg className="animate-spin h-6 w-6 text-[#8FC261]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return authenticated
    ? <AdminDashboard onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />
}
