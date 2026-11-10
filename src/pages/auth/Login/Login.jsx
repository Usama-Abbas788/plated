import { ChefHat, ShieldCheck } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../../stores/authStore'
import useRoleStore from '../../../stores/domain/roleStore'
import { getHomePath } from '../../../auth/permissions'

const demoRoles = (roles) => roles.filter(
  (role) => role.status === 'Active' && role.name !== 'Delivery Staff',
)

const Login = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
  const roles = useRoleStore((state) => state.roles)
  const navigate = useNavigate()
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to={getHomePath(user?.permissions)} replace />
  }

  const handleDemoLogin = (role) => {
    login(role)
    navigate(location.state?.from?.pathname || '/owner/dashboard', {
      replace: true,
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-main px-4 py-8">
      <section className="w-full max-w-3xl rounded-2xl border border-border-default bg-background-surface p-5 shadow-sm sm:p-8">
        <div className="mx-auto mb-7 flex max-w-lg flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white">
            <ChefHat size={30} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Staff sign in</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Staff access is created by the restaurant owner, who assigns each account its role and permissions.
          </p>
        </div>

        <div
          className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          role="note"
        >
          <ShieldCheck className="mt-0.5 shrink-0" size={18} />
          <p>
            <span className="font-semibold">Frontend demo sign-in.</span>{' '}
            This role selector is for preview only; it does not authenticate a real staff account. Staff self-signup is not available.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {demoRoles(roles).map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleDemoLogin(role)}
              className="rounded-xl border border-border-default p-4 text-left transition hover:border-brand-primary hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <span className="block font-semibold text-text-primary">{role.name}</span>
              <span className="mt-1 block text-sm leading-5 text-text-secondary">
                {role.description}
              </span>
            </button>
          ))}
        </div>
        {demoRoles(roles).length === 0 && (
          <p className="mt-4 text-center text-sm text-text-secondary" role="status">
            No active demo roles are available.
          </p>
        )}
        <p className="mt-6 text-center text-sm text-text-secondary">
          Ordering as a customer?{' '}
          <Link to="/account" className="font-semibold text-brand-primary hover:underline">Sign in or create a customer account</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
