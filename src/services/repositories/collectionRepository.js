import { apiRequest } from '../api/client'

const dataSource = import.meta.env.VITE_DATA_SOURCE || 'mock'

if (!['mock', 'api'].includes(dataSource)) {
  throw new Error(`Unsupported VITE_DATA_SOURCE "${dataSource}". Use "mock" or "api".`)
}

export const isApiDataSource = dataSource === 'api'

const getResponseData = (payload) => payload?.data ?? payload

const createMockRepository = (initialData) => {
  let records = initialData.map((record) => ({ ...record }))

  return {
    list: async () => records.map((record) => ({ ...record })),
    create: async (record) => {
      const maxNumericId = records.reduce(
        (maximum, current) =>
          typeof current.id === 'number' ? Math.max(maximum, current.id) : maximum,
        0,
      )
      const created = { ...record, id: Math.max(Date.now(), maxNumericId + 1) }
      records = [created, ...records]
      return { ...created }
    },
    update: async (id, updates) => {
      const existing = records.find((record) => record.id === id)
      if (!existing) throw new Error('The requested record no longer exists.')
      const updated = { ...existing, ...updates }
      records = records.map((record) => (record.id === id ? updated : record))
      return { ...updated }
    },
    remove: async (id) => {
      const exists = records.some((record) => record.id === id)
      if (!exists) throw new Error('The requested record no longer exists.')
      records = records.filter((record) => record.id !== id)
    },
  }
}

const createApiRepository = (endpoint) => ({
  list: async () => {
    const data = getResponseData(await apiRequest(endpoint))
    if (!Array.isArray(data)) {
      throw new Error(`The API response for ${endpoint} must be an array.`)
    }
    return data
  },
  create: async (record) =>
    getResponseData(await apiRequest(endpoint, { method: 'POST', body: record })),
  update: async (id, updates) =>
    getResponseData(await apiRequest(`${endpoint}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: updates,
    })),
  remove: async (id) => {
    await apiRequest(`${endpoint}/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
})

export const createCollectionRepository = (endpoint, initialData) =>
  isApiDataSource
    ? createApiRepository(endpoint)
    : createMockRepository(initialData)
