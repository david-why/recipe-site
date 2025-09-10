import { readdirSync } from 'fs'
import { resolve } from 'path'

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

// handle SPA static routes

const publicPath = resolve(__dirname, 'dist')
const index = () =>
  new Response(Bun.file(`${publicPath}/index.html`), {
    headers: { 'Content-Type': 'text/html' },
  })

const staticFiles: Record<string, () => Response> = {}
for (const fileName of readdirSync(publicPath, { recursive: true }) as string[]) {
  const file = Bun.file(resolve(publicPath, fileName))
  if (await file.exists()) {
    staticFiles[`/${fileName}`] = () => new Response(file)
  }
}

staticFiles['/'] = index

// start the server :yay:

Bun.serve({
  routes: {
    ...staticFiles,
  },
  async fetch(req) {
    if (req.method !== 'GET') {
      return new Response('Not Found', { status: 404 })
    }
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
