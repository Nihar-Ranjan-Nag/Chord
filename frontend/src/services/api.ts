const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'

const ACCESS_TOKEN_KEY = 'campusspark_access_token'
const REFRESH_TOKEN_KEY = 'campusspark_refresh_token'

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set(accessToken: string, refreshToken?: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

type ApiOptions = RequestInit & { auth?: boolean; retry?: boolean }

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(body?.message || `Request failed (${response.status})`)
  }
  return body
}

export async function api<T = any>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { auth = false, retry = true, headers, ...rest } = options
  const requestHeaders = new Headers(headers)

  if (rest.body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = tokenStore.getAccess()
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: requestHeaders,
  })

  if (response.status === 401 && auth && retry && tokenStore.getRefresh()) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokenStore.getRefresh() }),
    })
    const refreshBody = await parseResponse(refreshResponse)
    tokenStore.set(refreshBody.data.accessToken)
    requestHeaders.set('Authorization', `Bearer ${refreshBody.data.accessToken}`)

    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers: requestHeaders,
    })
  }

  return parseResponse(response)
}

export { API_BASE_URL }
