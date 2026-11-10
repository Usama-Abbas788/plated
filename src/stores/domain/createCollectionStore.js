import { create } from 'zustand'
import {
  createCollectionRepository,
  isApiDataSource,
} from '../../services/repositories/collectionRepository'

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'An unexpected data error occurred.'

export const createCollectionStore = ({
  collectionKey,
  endpoint,
  initialData,
  createAction,
  updateAction,
  deleteAction,
  createDefaults = {},
}) => {
  const repository = createCollectionRepository(endpoint, initialData)

  return create((set, get) => ({
    [collectionKey]: isApiDataSource ? [] : initialData,
    isLoading: false,
    hasLoaded: !isApiDataSource,
    error: null,

    load: async () => {
      set({ isLoading: true, error: null })
      try {
        const records = await repository.list()
        set({ [collectionKey]: records, hasLoaded: true })
        return records
      } catch (error) {
        set({ error: getErrorMessage(error) })
        return null
      } finally {
        set({ isLoading: false })
      }
    },

    [createAction]: async (record) => {
      set({ error: null })
      try {
        const created = await repository.create({ ...createDefaults, ...record })
        if (created == null) {
          throw new Error(`The API response for ${endpoint} did not include the created record.`)
        }
        set((state) => ({
          [collectionKey]: [created, ...state[collectionKey]],
        }))
        return created
      } catch (error) {
        set({ error: getErrorMessage(error) })
        return null
      }
    },

    [updateAction]: async (id, updates) => {
      set({ error: null })
      try {
        const response = await repository.update(id, updates)
        const existing = get()[collectionKey].find((record) => record.id === id)
        if (!existing) {
          throw new Error('The requested record is no longer available in the current list.')
        }
        const updated = { ...existing, ...updates, ...(response || {}) }
        set((state) => ({
          [collectionKey]: state[collectionKey].map((record) =>
            record.id === id ? updated : record,
          ),
        }))
        return updated
      } catch (error) {
        set({ error: getErrorMessage(error) })
        return null
      }
    },

    ...(deleteAction
      ? {
          [deleteAction]: async (id) => {
            set({ error: null })
            try {
              await repository.remove(id)
              set((state) => ({
                [collectionKey]: state[collectionKey].filter(
                  (record) => record.id !== id,
                ),
              }))
              return true
            } catch (error) {
              set({ error: getErrorMessage(error) })
              return false
            }
          },
        }
      : {}),
  }))
}
