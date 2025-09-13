import axios from 'axios'
import type { Recipe } from '../shared/types'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
})

service.interceptors.response.use(
  (response) => {
    return JSON.parse(response.data)
  },
  (error) => {
    return Promise.reject(error)
  },
)

export async function getRecipes(): Promise<Recipe[]> {
  return service.get('/recipes')
}
