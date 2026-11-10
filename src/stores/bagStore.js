import { create } from 'zustand'

const getProductId = (product) => String(product.id)
const getSizeKey = (size) => String(size?.id ?? size?.name ?? 'Regular')
const getItemKey = (productId, size) => `${String(productId)}::${getSizeKey(size)}`
const getStockLimit = (product) => {
  const stock = Number(product.stock)
  return Number.isFinite(stock) ? stock : Infinity
}

const useBagStore = create((set) => ({
  items: [],

  addItem: (product, selectedSize = product.sizes?.[0]) =>
    set((state) => {
      const productId = getProductId(product)
      const size = selectedSize || { name: 'Regular', price: product.price }
      const itemKey = getItemKey(productId, size)
      const existing = state.items.find((item) => getItemKey(item.product.id, item.size) === itemKey)
      const productQuantity = state.items
        .filter((item) => getProductId(item.product) === productId)
        .reduce((total, item) => total + item.quantity, 0)
      const stockLimit = getStockLimit(product)

      if (productQuantity >= stockLimit) return state

      return {
        items: existing
          ? state.items.map((item) =>
              getItemKey(item.product.id, item.size) === itemKey
                ? { ...item, product, size, quantity: item.quantity + 1 }
                : item,
            )
          : [...state.items, { product, size, quantity: 1 }],
      }
    }),

  setQuantity: (itemKey, quantity) =>
    set((state) => {
      const key = String(itemKey)
      const item = state.items.find((entry) => getItemKey(entry.product.id, entry.size) === key)
      if (!item) return state
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return { items: state.items.filter((entry) => getItemKey(entry.product.id, entry.size) !== key) }
      }

      const quantityOfOtherSizes = state.items
        .filter((entry) =>
          getProductId(entry.product) === getProductId(item.product) &&
          getItemKey(entry.product.id, entry.size) !== key,
        )
        .reduce((total, entry) => total + entry.quantity, 0)
      const stockLimit = getStockLimit(item.product)
      const nextQuantity = Math.min(quantity, stockLimit - quantityOfOtherSizes)
      if (nextQuantity <= 0) {
        return {
          items: state.items.filter(
            (entry) => getItemKey(entry.product.id, entry.size) !== key,
          ),
        }
      }

      return {
        items: state.items.map((entry) =>
          getItemKey(entry.product.id, entry.size) === key
            ? { ...entry, quantity: nextQuantity }
            : entry,
        ),
      }
    }),

  removeItem: (itemKey) =>
    set((state) => ({
      items: state.items.filter(
        (item) => getItemKey(item.product.id, item.size) !== String(itemKey),
      ),
    })),

  clearBag: () => set({ items: [] }),
}))

export default useBagStore
