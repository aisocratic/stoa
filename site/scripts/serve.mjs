// Zero-dependency static server for the exported gallery (Playwright smoke + local preview).
import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const root = join(import.meta.dirname, "..", "out")
const port = Number(process.env.PORT ?? 4321)
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
}

createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "")
  let file = join(root, path)
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html")
  if (!existsSync(file) && existsSync(file + ".html")) file += ".html"
  if (!existsSync(file)) {
    res.writeHead(404)
    res.end("not found")
    return
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" })
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`gallery on http://localhost:${port}`))
