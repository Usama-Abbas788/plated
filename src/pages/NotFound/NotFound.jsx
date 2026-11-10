import { Link } from 'react-router-dom'
import { CircleHelp } from 'lucide-react'

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
    <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <CircleHelp size={48} className="mx-auto text-orange-700" />
      <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-orange-700">404 · Page not found</p>
      <h1 className="mt-3 text-3xl font-bold text-stone-900">We couldn’t find that page</h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">
        The address may be incorrect, or the page may have moved.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex rounded-full bg-orange-700 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-800"
      >
        Back to the menu
      </Link>
    </section>
  </main>
)

export default NotFound
