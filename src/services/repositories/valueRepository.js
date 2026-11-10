import { apiRequest } from '../api/client'
import { isApiDataSource } from './collectionRepository'

const getResponseData = (payload) => payload?.data ?? payload

export const createValueRepository = (endpoint, initialValue) => {
  let value = initialValue

  return {
    get: async (query) => {
      if (isApiDataSource) {
        const search = query
          ? `?${new URLSearchParams(query).toString()}`
          : ''
        return getResponseData(await apiRequest(`${endpoint}${search}`))
      }
      return value
    },
    update: async (updates) => {
      if (isApiDataSource) {
        const response = getResponseData(await apiRequest(endpoint, {
          method: 'PUT',
          body: updates,
        }))
        return response ?? updates
      }
      value = { ...value, ...updates }
      return value
    },
  }
}
