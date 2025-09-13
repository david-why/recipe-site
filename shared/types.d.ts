export interface Recipe {
  id: number
  title: string
  tags: string[]
  active_time: number | null
  total_time: number | null
  difficulty: 'easy' | 'medium' | 'advanced'
  serving_size: number
  serving_unit: string | null
  images: string[]
  additional_info: string[]
  created_at: string
}

export interface Category {
  id: string
  name: string
}

// api types

export interface Pagination {
  page: number
  size: number
}
