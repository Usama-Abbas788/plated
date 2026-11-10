import { create } from 'zustand'
import { isApiDataSource } from '../../services/repositories/collectionRepository'
import { createValueRepository } from '../../services/repositories/valueRepository'

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'An unexpected data error occurred.'

export const createValueStore = ({
  stateKey,
  endpoint,
  initialValue,
  updateAction,
}) => {
  const repository = createValueRepository(endpoint, initialValue)

  return create((set) => ({
    [stateKey]: initialValue,
    isLoading: false,
    hasLoaded: !isApiDataSource,
    error: null,

    load: async (query) => {
      set({ isLoading: true, error: null })
      try {
        const value = await repository.get(query)
        if (value == null) {
          throw new Error(`The API response for ${endpoint} was empty.`)
        }
        set({ [stateKey]: value, hasLoaded: true })
        return value
      } catch (error) {
        set({ error: getErrorMessage(error) })
        return null
      } finally {
        set({ isLoading: false })
      }
    },

    ...(updateAction
      ? {
          [updateAction]: async (updates) => {
            set({ error: null })
            try {
              const value = await repository.update(updates)
              if (value == null) {
                throw new Error(`The API response for ${endpoint} was empty.`)
              }
              set({ [stateKey]: value })
              return value
            } catch (error) {
              set({ error: getErrorMessage(error) })
              return null
            }
          },
        }
      : {}),
  }))
}
