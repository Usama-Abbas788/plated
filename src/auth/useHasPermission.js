import useAuthStore from '../stores/authStore'

const useHasPermission = (permission) =>
  useAuthStore((state) => state.user?.permissions.includes(permission) ?? false)

export default useHasPermission
