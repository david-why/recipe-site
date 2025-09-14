import { readdirSync } from 'fs'
import { resolve } from 'path'
import {
  getCategories,
  getCategoryById,
  getCategoryRecipes,
  getCollectionById,
  getCollectionRecipes,
  getCollections,
  getRecipeById,
  getRecipes,
  searchRecipes,
} from './backend/database'

const PORT = Number(process.env.PORT || 20223)

// return an error with a status code

class BizError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}

// some constant routes

const index = () =>
  new Response(Bun.file(`${publicPath}/index.html`), {
    headers: { 'Content-Type': 'text/html' },
  })
const notFound = () => new Response('Not Found', { status: 404 })

// handle SPA static routes

const publicPath = resolve(__dirname, 'dist')

const staticFiles: Record<string, () => Response> = {}
for (const fileName of readdirSync(publicPath, { recursive: true }) as string[]) {
  const file = Bun.file(resolve(publicPath, fileName))
  if (await file.exists()) {
    staticFiles[`/${fileName}`] = () => {
      return new Response(file)
    }
  }
}

staticFiles['/'] = index

// start the server :yay:

Bun.serve({
  routes: {
    ...staticFiles,
    '/api/recipes': {
      GET: async () => {
        return Response.json(await getRecipes())
      },
    },
    '/api/categories': {
      GET: async () => {
        return Response.json(await getCategories())
      },
    },
    '/api/categories/:categoryId': {
      GET: async (req) => {
        const categoryId = req.params.categoryId
        return Response.json(await getCategoryById(categoryId))
      },
    },
    '/api/categories/:categoryId/recipes': {
      GET: async (req) => {
        const categoryId = req.params.categoryId
        return Response.json(
          await getCategoryRecipes({
            categoryId,
          }),
        )
      },
    },
    '/api/recipes/:recipeId': {
      GET: async (req) => {
        const recipeId = req.params.recipeId
        return Response.json(await getRecipeById({ recipeId }))
      },
    },
    '/api/search': {
      GET: async (req) => {
        const url = new URL(req.url)
        const query = url.searchParams.get('q') || ''
        return Response.json(await searchRecipes(query))
      },
    },
    '/api/collections': {
      GET: async () => {
        return Response.json(await getCollections())
      },
    },
    '/api/collections/:collectionId': {
      GET: async (req) => {
        const collectionId = req.params.collectionId
        return Response.json(await getCollectionById({ collectionId }))
      },
    },
    '/api/collections/:collectionId/recipes': {
      GET: async (req) => {
        const collectionId = req.params.collectionId
        return Response.json(await getCollectionRecipes({ collectionId }))
      },
    },
    '/api/*': notFound,
  },
  async fetch(req) {
    if (req.method !== 'GET') {
      return notFound()
    }
    console.log('Request:', req.url)
    return index()
  },
  error(error) {
    if (error instanceof BizError) {
      return Response.json({ message: error.message }, { status: error.status })
    }
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  },
  port: PORT,
})

console.log(`Server listening on http://localhost:${PORT}`)
