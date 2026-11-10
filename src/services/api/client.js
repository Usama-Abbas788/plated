const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL must be configured when VITE_DATA_SOURCE is "api".')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  const payload = response.status === 204 ? null : await response.json()

  if (!response.ok) {
    throw new ApiError(
      payload?.message || response.statusText || 'The API request failed.',
      response.status,
    )
  }

  return payload
}
