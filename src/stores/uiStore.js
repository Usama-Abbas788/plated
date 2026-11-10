
import { create } from 'zustand'

const useUIStore = create((set) => ({
  isSidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  openSidebar: () =>
    set({ isSidebarOpen: true }),

  closeSidebar: () =>
    set({ isSidebarOpen: false }),
}))

export default useUIStore
