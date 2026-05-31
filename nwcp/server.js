import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createProxyMiddleware } from 'http-proxy-middleware'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')
const port = Number(process.env.PORT) || 3000
const apiBase = (process.env.API_BASE_URL || '').replace(/\/$/, '')

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
  process.exit(1)
})

if (!fs.existsSync(distPath)) {
  console.error(`FATAL: dist folder not found at ${distPath}`)
  process.exit(1)
}

const app = express()

if (apiBase) {
  console.log(`Proxying /api to ${apiBase}`)
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiBase,
      changeOrigin: true,
      secure: true,
      onError: (error, req, res) => {
        console.error(`API proxy error for ${req.url}:`, error.message)
        if (!res.headersSent) {
          res.status(502).json({ error: 'API unavailable' })
        }
      },
    })
  )
} else {
  console.warn('API_BASE_URL is not set; /api requests will not be proxied')
}

app.use(express.static(distPath))

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (error) => {
    if (error) {
      console.error(`Failed to serve index.html for ${req.url}:`, error.message)
      if (!res.headersSent) {
        res.status(500).send('Application files missing')
      }
    }
  })
})

const server = app.listen(port, () => {
  console.log(`NWCP listening on port ${port}`)
  console.log(`Serving static files from ${distPath}`)
})

server.on('error', (error) => {
  console.error('Server failed to start:', error)
  process.exit(1)
})
