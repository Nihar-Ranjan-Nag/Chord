const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ||
  'https://chord-backend-x0l6.onrender.com/api/v1'

const ACCESS_TOKEN_KEY =
  'campusspark_access_token'

const REFRESH_TOKEN_KEY =
  'campusspark_refresh_token'

/* ============================================================
   TOKEN STORAGE
============================================================ */

export const tokenStore = {
  getAccess: () =>
    localStorage.getItem(
      ACCESS_TOKEN_KEY
    ),

  getRefresh: () =>
    localStorage.getItem(
      REFRESH_TOKEN_KEY
    ),

  set(
    accessToken: string,
    refreshToken?: string
  ) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken
    )

    if (refreshToken) {
      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        refreshToken
      )
    }
  },

  clear() {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    )

    localStorage.removeItem(
      REFRESH_TOKEN_KEY
    )
  },
}

/* ============================================================
   API TYPES
============================================================ */

type ApiOptions =
  RequestInit & {
    auth?: boolean
    retry?: boolean
  }

/* ============================================================
   PARSE RESPONSE
============================================================ */

async function parseResponse(
  response: Response
) {
  const body =
    await response
      .json()
      .catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      body?.message ||
        `Request failed (${response.status})`
    )
  }

  return body
}

/* ============================================================
   API
============================================================ */

export async function api<
  T = any,
>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    auth = false,
    retry = true,
    headers,
    ...rest
  } = options

  const requestHeaders =
    new Headers(
      headers
    )

  /* ==========================================================
     JSON CONTENT TYPE
  ========================================================== */

  if (
    rest.body &&
    !requestHeaders.has(
      'Content-Type'
    )
  ) {
    requestHeaders.set(
      'Content-Type',
      'application/json'
    )
  }

  /* ==========================================================
     ACCESS TOKEN
  ========================================================== */

  if (auth) {
    const token =
      tokenStore.getAccess()

    if (token) {
      requestHeaders.set(
        'Authorization',
        `Bearer ${token}`
      )
    }
  }

  /* ==========================================================
     FIRST REQUEST
  ========================================================== */

  let response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...rest,
        headers:
          requestHeaders,
      }
    )

  /* ==========================================================
     ACCESS TOKEN EXPIRED
  ========================================================== */

  if (
    response.status ===
      401 &&
    auth &&
    retry
  ) {
    const refreshToken =
      tokenStore.getRefresh()

    if (!refreshToken) {
      tokenStore.clear()

      return parseResponse(
        response
      )
    }

    try {
      /* ======================================================
         REFRESH TOKEN
      ====================================================== */

      const refreshResponse =
        await fetch(
          `${API_BASE_URL}/auth/refresh`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                refreshToken,
              }),
          }
        )

      const refreshBody: any =
        await parseResponse(
          refreshResponse
        )

      const newAccessToken =
        refreshBody
          ?.data
          ?.accessToken

      const newRefreshToken =
        refreshBody
          ?.data
          ?.refreshToken

      if (
        !newAccessToken
      ) {
        throw new Error(
          'Unable to refresh session'
        )
      }

      /*
       * If backend rotates refresh tokens,
       * save the new refresh token too.
       *
       * Otherwise retain the existing one.
       */
      tokenStore.set(
        newAccessToken,
        newRefreshToken ||
          refreshToken
      )

      requestHeaders.set(
        'Authorization',
        `Bearer ${newAccessToken}`
      )

      /* ======================================================
         RETRY ORIGINAL REQUEST
      ====================================================== */

      response =
        await fetch(
          `${API_BASE_URL}${endpoint}`,
          {
            ...rest,
            headers:
              requestHeaders,
          }
        )
    } catch (error) {
      /*
       * Invalid/expired refresh session.
       */
      tokenStore.clear()

      throw error
    }
  }

  return parseResponse(
    response
  )
}

export {
  API_BASE_URL,
}