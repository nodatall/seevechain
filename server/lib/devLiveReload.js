const fs = require('fs')
const path = require('path')

const RELOADABLE_EXTENSIONS = new Set(['.html', '.js', '.css', '.map'])

function setupDevLiveReload(app, options = {}) {
  if (process.env.NODE_ENV === 'production') return

  const distPath = options.distPath || path.resolve(__dirname, '../../client/dist')
  const clients = new Set()
  let reloadTimeout = null

  app.get('/__dev_reload', (req, res) => {
    res.writeHead(200, {
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
      'X-Accel-Buffering': 'no',
    })
    res.write('\n')
    clients.add(res)

    req.on('close', () => {
      clients.delete(res)
    })
  })

  function sendReload() {
    clients.forEach(res => {
      res.write('event: reload\n')
      res.write(`data: ${Date.now()}\n\n`)
    })
  }

  function scheduleReload(filename) {
    if (!filename) return
    if (!RELOADABLE_EXTENSIONS.has(path.extname(filename))) return

    clearTimeout(reloadTimeout)
    reloadTimeout = setTimeout(sendReload, 150)
  }

  if (!fs.existsSync(distPath)) return

  try {
    fs.watch(distPath, (_eventType, filename) => scheduleReload(filename))
  } catch (error) {
    // Live reload is a development convenience. The app should still boot if
    // the local filesystem watcher is unavailable.
  }
}

module.exports = setupDevLiveReload
