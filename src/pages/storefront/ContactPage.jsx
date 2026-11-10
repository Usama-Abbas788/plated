import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquareWarning, Phone, Send } from 'lucide-react'
import useCustomerStore from '../../stores/customerStore'

const initialForm = { name: '', email: '', subject: '', category: 'Food quality', orderNumber: '', message: '' }
const complaintCategories = ['Food quality', 'Order issue', 'Delivery', 'Payment', 'Other']

const ContactPage = () => {
  const user = useCustomerStore((state) => state.user)
  const submitSupportRequest = useCustomerStore((state) => state.submitSupportRequest)
  const [type, setType] = useState('contact')
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setForm((previous) => ({
      ...previous,
      name: previous.name || user.name,
      email: previous.email || user.email,
    }))
  }, [user])

  const handleTypeChange = (nextType) => {
    setType(nextType)
    setSubmitted(false)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    try {
      submitSupportRequest({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLocaleLowerCase(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        type,
        customerId: user?.id || null,
      })
      setSubmitted(true)
      setForm({ ...initialForm, name: user?.name || '', email: user?.email || '' })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Your message could not be submitted.')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="text-xl font-bold tracking-tight" aria-label="Plated home">Plated</Link>
          <div className="flex items-center gap-2">
            <Link to="/account" className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100">My account</Link>
            <Link to="/bag" className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700">Bag</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-700">
          <ArrowLeft size={17} /> Back to menu
        </Link>
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <section>
            <p className="text-sm font-semibold text-orange-700">We’re here to help</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Contact us</h1>
            <p className="mt-3 max-w-lg leading-7 text-stone-600">Have a question or something about your experience that we should know? Send our team a message or submit a complaint and include your order number if you have it.</p>
            <div className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
              <a href="mailto:contact@plated.com" className="flex items-center gap-3 text-sm font-medium text-stone-700 hover:text-orange-700">
                <Mail size={18} className="text-orange-700" /> contact@plated.com
              </a>
              <p className="flex items-center gap-3 text-sm text-stone-500">
                <Phone size={18} className="text-orange-700" /> Leave your number and we’ll follow up.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="grid grid-cols-2 rounded-xl bg-stone-100 p-1" role="tablist" aria-label="Support request type">
              <button type="button" role="tab" aria-selected={type === 'contact'} onClick={() => handleTypeChange('contact')} className={`rounded-lg px-2 py-2.5 text-sm font-semibold ${type === 'contact' ? 'bg-white text-orange-800 shadow-sm' : 'text-stone-600'}`}>
                Contact us
              </button>
              <button type="button" role="tab" aria-selected={type === 'complaint'} onClick={() => handleTypeChange('complaint')} className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-semibold ${type === 'complaint' ? 'bg-white text-orange-800 shadow-sm' : 'text-stone-600'}`}>
                <MessageSquareWarning size={16} /> Submit a complaint
              </button>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900" role="status">
                <h2 className="font-bold">{type === 'complaint' ? 'Your complaint has been recorded.' : 'Your message has been recorded.'}</h2>
                <p className="mt-1 text-sm leading-6">Thanks for reaching out. This frontend demo records requests in this browser; connect the support service to deliver them to your team.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-3 text-sm font-semibold underline underline-offset-2">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Your name</span>
                    <input required autoComplete="name" maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Email</span>
                    <input required type="email" autoComplete="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                  </label>
                </div>
                {type === 'complaint' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">What is your complaint about?</span>
                      <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                        {complaintCategories.map((category) => <option key={category}>{category}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium">Order number <span className="font-normal text-stone-400">(optional)</span></span>
                      <input maxLength={50} value={form.orderNumber} onChange={(event) => setForm({ ...form, orderNumber: event.target.value })} placeholder="e.g. PL-123456" className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                    </label>
                  </div>
                ) : (
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Subject</span>
                    <input required maxLength={120} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                  </label>
                )}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">{type === 'complaint' ? 'Tell us what happened' : 'Your message'}</span>
                  <textarea required minLength={10} maxLength={2000} rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={type === 'complaint' ? 'Please describe the issue so we can help...' : 'How can we help?'} className="w-full resize-y rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                  <span className="mt-1 block text-xs text-stone-500">10–2000 characters</span>
                </label>
                {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-3 font-semibold text-white hover:bg-orange-800">
                  <Send size={17} /> {type === 'complaint' ? 'Submit complaint' : 'Send message'}
                </button>
                <p className="text-xs leading-5 text-stone-500">This frontend demo records requests in this browser. Connect the support form to your service backend to receive them centrally.</p>
              </form>
            )}
          </section>
        </div>
      </main>
      <footer className="mt-10 border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 py-6 text-sm sm:px-6">
          <Link to="/account" className="font-medium text-stone-600 hover:text-orange-700">Customer account</Link>
          <Link to="/login" className="font-medium text-stone-600 hover:text-orange-700">Staff sign in</Link>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
