export interface Event {
  id: string
  title: string
  description: string
  link: string
  image_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  description: string
  link: string
  image_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}
