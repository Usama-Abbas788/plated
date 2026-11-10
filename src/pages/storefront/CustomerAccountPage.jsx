import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, LogOut, PackageCheck, UserRound } from 'lucide-react'
import useCustomerStore from '../../stores/customerStore'

const formatPrice = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`
const formatDate = (date) => {
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString()
}

const CustomerAccountPage = () => {
  const user = useCustomerStore((state) => state.user)
  const orders = useCustomerStore((state) => state.orders)
  const registerCustomer = useCustomerStore((state) => state.registerCustomer)
  const loginCustomer = useCustomerStore((state) => state.loginCustomer)
  const logoutCustomer = useCustomerStore((state) => state.logoutCustomer)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const accountOrders = orders
    .filter((order) => order.customerId === user?.id)
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      if (mode === 'signup') await registerCustomer(form)
      else await loginCustomer(form)
      setForm({ name: '', email: '', password: '' })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to access your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold tracking-tight" aria-label="Plated home">Plated</Link>
          <Link to="/menu" className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100">Browse menu</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-700">
          <ArrowLeft size={17} /> Back to menu
        </Link>

        {user ? (
          <>
            <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-orange-700 to-amber-500 p-6 text-white sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20"><UserRound size={24} /></span>
                <div>
                  <p className="text-sm text-orange-100">Your Plated account</p>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-sm text-orange-50">{user.email}</p>
                </div>
              </div>
              <button type="button" onClick={logoutCustomer} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/25">
                <LogOut size={16} /> Sign out
              </button>
            </section>

            <section className="mt-8" aria-labelledby="order-history-heading">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-orange-700">All in one place</p>
                  <h2 id="order-history-heading" className="mt-1 text-2xl font-bold">Order history</h2>
                </div>
                <Link to="/contact" className="text-sm font-semibold text-orange-700 hover:text-orange-900">Need help?</Link>
              </div>

              {accountOrders.length ? (
                <ul className="mt-5 space-y-4">
                  {accountOrders.map((order) => (
                    <li key={order.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">Order #{order.orderNumber || order.id}</p>
                          <p className="mt-1 text-sm text-stone-500">{formatDate(order.date || order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(order.total)}</p>
                          <span className="mt-1 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800">{order.status || 'Received'}</span>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3 text-sm text-stone-600">
                        {(order.items || []).map((item, index) => (
                          <li key={`${item.productId || item.name}-${index}`}>
                            {item.quantity} × {item.name}{item.size ? ` (${item.size})` : ''}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                  <PackageCheck size={38} className="mx-auto text-stone-300" />
                  <h3 className="mt-3 font-semibold">Your order history will appear here</h3>
                  <p className="mt-1 text-sm text-stone-500">Place an order while signed in to keep track of it here.</p>
                  <Link to="/menu" className="mt-5 inline-flex rounded-full bg-orange-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-800">Explore the menu</Link>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="mx-auto mt-6 max-w-lg rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-orange-700">Your Plated account</p>
            <h1 className="mt-1 text-3xl font-bold">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {mode === 'signup'
                ? 'Save your account to see your order history and get back to your details faster.'
                : 'Sign in to view your orders and make your next visit easier.'}
            </p>

            <div className="mt-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1" role="tablist" aria-label="Account action">
              <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => { setMode('login'); setError('') }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-orange-800 shadow-sm' : 'text-stone-600'}`}>Sign in</button>
              <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => { setMode('signup'); setError('') }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'signup' ? 'bg-white text-orange-800 shadow-sm' : 'text-stone-600'}`}>Create account</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === 'signup' && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Name</span>
                  <input required autoComplete="name" maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Email</span>
                <input required type="email" autoComplete="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Password</span>
                <input required type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 8 : undefined} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                {mode === 'signup' && <span className="mt-1 block text-xs text-stone-500">Use at least 8 characters.</span>}
              </label>
              {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-orange-700 px-4 py-3 font-semibold text-white hover:bg-orange-800 disabled:opacity-50">
                {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              This frontend demo saves customer accounts in this browser. Connect a secure authentication service before using real customer accounts.
            </p>
          </section>
        )}
      </main>
      <footer className="mt-10 border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-6 text-sm sm:px-6">
          <Link to="/contact" className="font-medium text-stone-600 hover:text-orange-700">Contact us / complaints</Link>
          <Link to="/login" className="font-medium text-stone-600 hover:text-orange-700">Staff sign in</Link>
        </div>
      </footer>
    </div>
  )
}

export default CustomerAccountPage
