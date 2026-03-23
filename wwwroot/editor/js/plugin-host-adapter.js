;(function () {
  const updateDataListeners = new Set()
  const localStateListeners = new Set()
  const pendingRpc = new Map()
  const clientSourceId = `plugin_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  let rpcCounter = 0
  let eventSource = null
  let officialModelMapPromise = null

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value))
  }

  function buildUrl(path) {
    return new URL(path, window.location.href).toString()
  }

  async function fetchJson(path, init) {
    const response = await fetch(buildUrl(path), init)
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }

  function ensureEventSource() {
    if (eventSource || typeof EventSource === 'undefined') return
    eventSource = new EventSource(buildUrl('/api/sse'))
    eventSource.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data)
        if (!packet || typeof packet !== 'object') return

        if (packet.type === 'layout' && packet.sourceId && packet.sourceId === clientSourceId) {
          return
        }

        if (packet.type === 'state' && packet.state) {
          const state = clone(packet.state)
          updateDataListeners.forEach((cb) => cb({ type: 'state', state }))
          localStateListeners.forEach((cb) => cb(clone(state)))
          return
        }

        updateDataListeners.forEach((cb) => cb(clone(packet)))
      } catch (error) {
        console.warn('[3DViewerIDV] SSE packet parse failed:', error)
      }
    }
    eventSource.onerror = () => {
      console.warn('[3DViewerIDV] SSE disconnected, waiting for browser reconnect')
    }
  }

  function getWebViewBridge() {
    return window.chrome && window.chrome.webview ? window.chrome.webview : null
  }

  function callHost(action, payload) {
    const bridge = getWebViewBridge()
    if (!bridge) {
      return Promise.resolve({ success: false, error: 'host-unavailable' })
    }

    const requestId = `rpc_${Date.now()}_${++rpcCounter}`
    return new Promise((resolve) => {
      pendingRpc.set(requestId, resolve)
      bridge.postMessage({
        type: 'plugin-host-request',
        requestId,
        action,
        payload: payload || null
      })
    })
  }

  async function getOfficialModelMap() {
    if (!officialModelMapPromise) {
      officialModelMapPromise = fetchJson('/api/models/index').catch((error) => {
        console.warn('[3DViewerIDV] Failed to load official model map:', error)
        return {}
      })
    }
    return officialModelMapPromise
  }

  window.addEventListener('DOMContentLoaded', () => {
    ensureEventSource()
  })

  const bridge = getWebViewBridge()
  if (bridge) {
    bridge.addEventListener('message', (event) => {
      const packet = event.data || {}
      if (packet.type !== 'plugin-host-response' || !packet.requestId) return
      const resolver = pendingRpc.get(packet.requestId)
      if (!resolver) return
      pendingRpc.delete(packet.requestId)
      resolver(packet.payload || { success: false, error: 'empty-response' })
    })
  }

  const pluginHost = {
    async getState() {
      return fetchJson('/api/state')
    },
    async getLayout() {
      return fetchJson('/api/layout')
    },
    async saveLayout(layout) {
      return fetchJson('/api/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: clientSourceId,
          layout: layout ?? null
        })
      })
    },
    async pickFile(kind) {
      const extensions = kind === 'video'
        ? ['mp4', 'webm', 'ogg', 'mov', 'm4v']
        : ['gltf', 'glb', 'obj', 'mtl']
      return callHost('selectFileWithFilter', {
        filters: [{ name: kind || 'Files', extensions }]
      })
    },
    async importAsset(path, kind) {
      return fetchJson('/api/import-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          copyMode: kind === 'video' ? 'file' : 'auto'
        })
      })
    },
    async getOfficialModelPath(roleName) {
      const map = await getOfficialModelMap()
      const key = String(roleName || '').replace(/\.png$/i, '').replace(/["“”']/g, '').trim().toLowerCase()
      const value = map && typeof map === 'object' ? map[key] : ''
      return value ? buildUrl(value) : ''
    },
    subscribeEvents(handler) {
      if (typeof handler !== 'function') return () => {}
      updateDataListeners.add(handler)
      ensureEventSource()
      return () => updateDataListeners.delete(handler)
    }
  }

  window.pluginHost = pluginHost
  window.electronAPI = window.electronAPI || {
    async invoke(channel, payload) {
      switch (channel) {
        case 'localBp:getState':
          return { success: true, data: await pluginHost.getState() }
        case 'localBp:saveCharacterModel3DLayout':
          await pluginHost.saveLayout(payload)
          return { success: true }
        case 'localBp:getOfficialModelLocalPath': {
          const httpUrl = await pluginHost.getOfficialModelPath(payload)
          return { success: !!httpUrl, path: '', httpUrl }
        }
        default:
          return { success: false, error: `unsupported-channel:${channel}` }
      }
    },
    async importBundledAsset(path, options) {
      const result = await fetchJson('/api/import-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          copyMode: options && options.copyMode ? options.copyMode : 'auto'
        })
      })
      return result || { success: false, error: 'empty-import-result' }
    },
    async selectFileWithFilter(options) {
      return callHost('selectFileWithFilter', options || {})
    },
    async readBinaryFile(path) {
      return callHost('readBinaryFile', { path })
    },
    async getOfficialModelMap() {
      return getOfficialModelMap()
    },
    onUpdateData(callback) {
      if (typeof callback !== 'function') return () => {}
      updateDataListeners.add(callback)
      ensureEventSource()
      return () => updateDataListeners.delete(callback)
    },
    onLocalBpStateUpdate(callback) {
      if (typeof callback !== 'function') return () => {}
      localStateListeners.add(callback)
      ensureEventSource()
      return () => localStateListeners.delete(callback)
    }
  }

  ensureEventSource()
})()
