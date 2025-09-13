import { sql } from 'bun'
import { getSqlLimitOffset, Pagination } from './pagination'

// db types

export interface DBRecipe {
  id: number
  title: string
  description: string | null
  ingredients: string | null
  instructions: string | null
  created_at: string
  updated_at: string
}

// db functions

interface GetRecipesOptions {
  pagination?: Pagination
}

export async function getRecipes({ pagination }: GetRecipesOptions = {}) {
  const recipes = await sql`SELECT * FROM recipes ${getSqlLimitOffset(pagination)}`
  return recipes
}
