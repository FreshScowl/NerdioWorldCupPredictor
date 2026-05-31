import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { createProxyMiddleware } from 'http-proxy-middleware'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 3000
const apiBase = (process.env.API_BASE_URL || '').replace(/\/$/, '')

if (apiBase) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiBase,
      changeOrigin: true,
      secure: true,
    })
  )
}

app.use(express.static(path.join(__dirname, 'dist')))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`NWCP listening on port ${port}`)
})
