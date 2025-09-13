import axios from 'axios'
import type { Category, Pagination, Recipe } from '../shared/types'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
})

service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

export async function getCategories(): Promise<Category[]> {
  return service.get('/categories')
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  return service.get(`/categories/${categoryId}`)
}

export async function getCategoryRecipes(
  categoryId: string,
  pagination?: Pagination,
): Promise<Recipe[]> {
  return service.get(`/categories/${categoryId}/recipes`, { params: pagination })
}
