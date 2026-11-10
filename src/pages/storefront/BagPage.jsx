import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Store, Trash2, X } from 'lucide-react'
import useBagStore from '../../stores/bagStore'
import useOrderStore from '../../stores/domain/orderStore'
import useCustomerStore from '../../stores/customerStore'

const formatPrice = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`
const getItemKey = (product, size) => `${String(product.id)}::${String(size?.id ?? size?.name ?? 'Regular')}`

const BagPage = () => {
  const items = useBagStore((state) => state.items)
  const setQuantity = useBagStore((state) => state.setQuantity)
  const removeItem = useBagStore((state) => state.removeItem)
  const clearBag = useBagStore((state) => state.clearBag)
  const addOrder = useOrderStore((state) => state.addOrder)
  const orderError = useOrderStore((state) => state.error)
  const customer = useCustomerStore((state) => state.user)
  const saveCustomerOrder = useCustomerStore((state) => state.saveCustomerOrder)
  const [checkout, setCheckout] = useState({ customer: '', email: '', phone: '', address: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)
  const bagCount = items.reduce((total, item) => total + item.quantity, 0)
  const bagTotal = items.reduce((total, item) => total + Number(item.size?.price ?? item.product.price) * item.quantity, 0)

  useEffect(() => {
    if (!customer) return
    setCheckout((previous) => ({
      ...previous,
      customer: previous.customer || customer.name,
      email: previous.email || customer.email,
    }))
  }, [customer])

  useEffect(() => {
    if (!placedOrder) return undefined
    const handleEscape = (event) => {
      if (event.key === 'Escape') setPlacedOrder(null)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [placedOrder])

  const handleCheckoutChange = (event) => {
    setCheckout((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    setCheckoutError('')
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    if (isSubmitting || !items.length) return

    setIsSubmitting(true)
    setCheckoutError('')
    const order = await addOrder({
      customer: checkout.customer.trim(),
      customerEmail: checkout.email.trim().toLocaleLowerCase(),
      customerId: customer?.id || null,
      phone: checkout.phone.trim(),
      address: checkout.address.trim(),
      orderNumber: `PL-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      items: items.map(({ product, size, quantity }) => ({
        productId: product.id,
        name: product.name,
        size: size?.name || 'Regular',
        quantity,
        unitPrice: Number(size?.price ?? product.price),
      })),
      itemCount: bagCount,
      total: bagTotal,
      paymentStatus: 'Unpaid',
      status: 'Pending',
      fulfillmentType: 'Delivery',
    })

    if (!order) {
      setCheckoutError(useOrderStore.getState().error || 'Your order could not be placed. Please try again.')
      setIsSubmitting(false)
      return
    }

    if (customer) saveCustomerOrder(order, customer.id)
    clearBag()
    setCheckout({
      customer: customer?.name || '',
      email: customer?.email || '',
      phone: '',
      address: '',
    })
    setPlacedOrder(order)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Plated home">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><Store size={23} /></span>
            <span><span className="block text-xl font-bold tracking-tight">Plated</span><span className="block text-xs text-stone-500">Your shopping bag</span></span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/account" className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100">Account</Link>
            <Link to="/" className="rounded-full px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100">Menu</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-orange-700">
          <ArrowLeft size={17} /> Continue browsing
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-orange-700">Ready when you are</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Your bag</h1>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1.5 text-sm font-semibold text-orange-800">{bagCount} {bagCount === 1 ? 'item' : 'items'}</span>
        </div>

        {items.length ? (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Bag items">
              <div className="flex justify-end border-b border-stone-100 pb-3">
                <button type="button" onClick={clearBag} className="text-sm font-medium text-red-600 hover:text-red-700">Clear bag</button>
              </div>
              <ul className="divide-y divide-stone-100">
                {items.map(({ product, size, quantity }) => {
                  const key = getItemKey(product, size)
                  const productQuantity = items
                    .filter((item) => String(item.product.id) === String(product.id))
                    .reduce((total, item) => total + item.quantity, 0)
                  const stock = Number(product.stock)
                  const unitPrice = Number(size?.price ?? product.price)
                  return (
                    <li key={key} className="flex gap-4 py-5 first:pt-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-50 sm:h-24 sm:w-24">
                        {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <span className="text-3xl" aria-hidden="true">🍽️</span>}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <Link to={`/product/${product.id}`} className="font-semibold hover:text-orange-700">{product.name}</Link>
                          <p className="mt-1 text-sm text-stone-500">{size?.name || 'Regular'} · {formatPrice(unitPrice)} each</p>
                          <div className="mt-3 flex items-center gap-2">
                            <button type="button" aria-label={`Decrease ${product.name} ${size?.name || ''} quantity`} onClick={() => setQuantity(key, quantity - 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-100"><Minus size={14} /></button>
                            <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
                            <button type="button" aria-label={`Increase ${product.name} ${size?.name || ''} quantity`} onClick={() => setQuantity(key, quantity + 1)} disabled={Number.isFinite(stock) && productQuantity >= stock} className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={14} /></button>
                            <button type="button" aria-label={`Remove ${product.name} ${size?.name || ''} from bag`} onClick={() => removeItem(key)} className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </div>
                        <span className="shrink-0 font-semibold">{formatPrice(unitPrice * quantity)}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-bold">Order summary</h2>
              <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 font-bold">
                <span>Total</span><span>{formatPrice(bagTotal)}</span>
              </div>
              <form onSubmit={handlePlaceOrder} className="mt-6 space-y-3">
                <h3 className="font-semibold">Delivery details</h3>
                {!customer && (
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm leading-5 text-orange-950">
                    Create a free account before checkout to save this order in your history and make future orders easier. You can also continue as a guest.
                    <Link to="/account" className="ml-1 font-bold underline underline-offset-2">Create account</Link>
                  </div>
                )}
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-stone-700">Your name</span>
                  <input name="customer" value={checkout.customer} onChange={handleCheckoutChange} autoComplete="name" required maxLength={100} className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-stone-700">Email address</span>
                  <input name="email" type="email" value={checkout.email} onChange={handleCheckoutChange} autoComplete="email" required maxLength={254} className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-stone-700">Phone number</span>
                  <input name="phone" type="tel" value={checkout.phone} onChange={handleCheckoutChange} autoComplete="tel" required maxLength={30} className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-stone-700">Delivery address</span>
                  <textarea name="address" value={checkout.address} onChange={handleCheckoutChange} autoComplete="street-address" required maxLength={500} rows={3} className="w-full resize-y rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
                </label>
                {(checkoutError || orderError) && <p className="text-sm text-red-700" role="alert">{checkoutError || orderError}</p>}
                <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-xl bg-orange-700 px-4 py-3 font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-50">
                  {isSubmitting ? 'Placing order...' : `Place order · ${formatPrice(bagTotal)}`}
                </button>
                <p className="text-center text-xs text-stone-500">Payment can be arranged when your order is confirmed.</p>
              </form>
            </aside>
          </div>
        ) : (
          <section className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <ShoppingBag size={42} className="mx-auto text-stone-300" />
            <h2 className="mt-4 text-xl font-semibold">Your bag is empty</h2>
            <p className="mt-2 text-sm text-stone-500">Explore the menu and add something delicious.</p>
            <Link to="/menu" className="mt-6 inline-flex rounded-full bg-orange-700 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-800">Browse the menu</Link>
          </section>
        )}
      </main>

      {placedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPlacedOrder(null)
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="order-success-title" className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl sm:p-8">
            <button type="button" onClick={() => setPlacedOrder(null)} aria-label="Close order confirmation" className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"><X size={20} /></button>
            <CheckCircle2 size={56} className="mx-auto mt-1 text-green-600" />
            <h2 id="order-success-title" className="mt-4 text-2xl font-bold">Order placed successfully!</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">Thank you, {placedOrder.customer}. Your order has been received and is awaiting confirmation.</p>
            {!placedOrder.customerId && (
              <p className="mt-3 rounded-xl bg-orange-50 p-3 text-sm leading-5 text-orange-950">
                Want to track future orders and see your history? <Link to="/account" onClick={() => setPlacedOrder(null)} className="font-bold underline underline-offset-2">Create a free account</Link>.
              </p>
            )}
            <div className="mt-5 rounded-xl bg-stone-50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Order number</p>
              <p className="mt-1 font-bold">#{placedOrder.orderNumber || placedOrder.id}</p>
              <div className="mt-3 flex justify-between text-sm"><span>{placedOrder.itemCount} items</span><span className="font-semibold">{formatPrice(placedOrder.total)}</span></div>
            </div>
            <Link to="/" onClick={() => setPlacedOrder(null)} className="mt-6 block w-full rounded-xl bg-stone-900 px-4 py-3 font-semibold text-white hover:bg-stone-700">Continue browsing</Link>
          </section>
        </div>
      )}
    </div>
  )
}

export default BagPage
