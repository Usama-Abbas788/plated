import { create } from 'zustand'

const STORAGE_KEY = 'plated-customer-data'
const EMPTY_DATA = { users: [], currentUserId: null, orders: [], requests: [] }

const readStoredData = () => {
  if (typeof window === 'undefined') return EMPTY_DATA

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? { ...EMPTY_DATA, ...JSON.parse(stored) } : EMPTY_DATA
  } catch (error) {
    console.error('Unable to read customer data from local storage.', error)
    return EMPTY_DATA
  }
}

const initialData = readStoredData()
const getPublicUser = (user) =>
  user ? { id: user.id, name: user.name, email: user.email } : null
const encodeBytes = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
const createSalt = () => {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure account sign-in is unavailable in this browser.')
  }
  const salt = new Uint8Array(16)
  globalThis.crypto.getRandomValues(salt)
  return encodeBytes(salt)
}
const derivePasswordHash = async (password, salt) => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure account sign-in is unavailable in this browser.')
  }
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: Uint8Array.from(salt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)),
      iterations: 120000,
      hash: 'SHA-256',
    },
    key,
    256,
  )
  return encodeBytes(new Uint8Array(bits))
}

const useCustomerStore = create((set, get) => ({
  ...initialData,
  user: getPublicUser(initialData.users.find((user) => user.id === initialData.currentUserId)),
  error: null,

  registerCustomer: async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLocaleLowerCase()
    if (get().users.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account already exists for this email. Please sign in instead.')
    }

    const passwordSalt = createSalt()
    const passwordHash = await derivePasswordHash(password, passwordSalt)
    const user = {
      id: `customer-${globalThis.crypto.randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordSalt,
      passwordHash,
    }
    const nextData = {
      users: [user, ...get().users],
      currentUserId: user.id,
      orders: get().orders,
      requests: get().requests,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    set({ ...nextData, user: getPublicUser(user), error: null })
    return getPublicUser(user)
  },

  loginCustomer: async ({ email, password }) => {
    const normalizedEmail = email.trim().toLocaleLowerCase()
    const account = get().users.find((user) => user.email === normalizedEmail)
    if (!account) throw new Error('Email or password is incorrect.')

    const passwordHash = await derivePasswordHash(password, account.passwordSalt)
    if (passwordHash !== account.passwordHash) {
      throw new Error('Email or password is incorrect.')
    }

    const nextData = {
      users: get().users,
      currentUserId: account.id,
      orders: get().orders,
      requests: get().requests,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    set({ ...nextData, user: getPublicUser(account), error: null })
    return getPublicUser(account)
  },

  logoutCustomer: () => {
    const nextData = { ...get(), currentUserId: null }
    const storedData = {
      users: nextData.users,
      currentUserId: null,
      orders: nextData.orders,
      requests: nextData.requests,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData))
    set({ ...storedData, user: null, error: null })
  },

  saveCustomerOrder: (order, customerId) => {
    if (!customerId) return
    const orders = [order, ...get().orders.filter((item) => item.id !== order.id)]
    const nextData = {
      users: get().users,
      currentUserId: get().currentUserId,
      orders,
      requests: get().requests,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    set({ ...nextData })
  },

  submitSupportRequest: (request) => {
    const requests = [
      { ...request, id: `support-${globalThis.crypto.randomUUID()}`, submittedAt: new Date().toISOString() },
      ...get().requests,
    ]
    const nextData = {
      users: get().users,
      currentUserId: get().currentUserId,
      orders: get().orders,
      requests,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    set({ ...nextData })
  },
}))

export default useCustomerStore
