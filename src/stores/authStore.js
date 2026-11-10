
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (role) =>
    set({
      user: {
        id: `demo-${role.id}`,
        name: role.name === 'Owner' ? 'Restaurant Owner' : `${role.name} Demo`,
        role: role.name,
        permissions: [...role.permissions],
      },
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}))

export default useAuthStore
