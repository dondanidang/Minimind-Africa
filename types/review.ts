export type Review = {
  id: string
  product_id: string
  user_id: string | null
  author_name: string
  location: string | null
  rating: number
  comment: string | null
  created_at: string
}

