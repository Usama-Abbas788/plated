
import { create } from 'zustand'

const useThemeStore = create((set) => ({
  theme: 'light',

  setTheme: (theme) => {
    document.documentElement.dataset.theme = theme
    set({ theme })
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme =
        state.theme === 'light' ? 'dark' : 'light'

      document.documentElement.dataset.theme = newTheme

      return { theme: newTheme }
    }),
}))

export default useThemeStore
