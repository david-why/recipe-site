import axios from 'axios'
import type { Category, Collection, FullRecipe, Recipe } from '../shared/types'

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

export async function getCategoryRecipes(categoryId: string): Promise<Recipe[]> {
  return service.get(`/categories/${categoryId}/recipes`)
}

export async function getRecipeById(recipeId: string): Promise<FullRecipe> {
  return service.get(`/recipes/${recipeId}`)
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  return service.get('/search', { params: { q: query } })
}

export async function getCollections(): Promise<Collection[]> {
  return service.get('/collections')
}

export async function getCollectionById(collectionId: string): Promise<Collection> {
  return service.get(`/collections/${collectionId}`)
}

export async function getCollectionRecipes(collectionId: string): Promise<Recipe[]> {
  return service.get(`/collections/${collectionId}/recipes`)
}
