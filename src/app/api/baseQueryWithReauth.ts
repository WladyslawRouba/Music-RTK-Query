import { baseQuery } from '@/app/api/baseQuery'
import { AUTH_KEYS } from '@/common/constants'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { isTokens } from '@/common/utils'

const mutex = new Mutex()

const AUTH_URLS = ['/auth/login', '/auth/refresh', '/auth/logout']
const AUTH_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const clearStoredTokens = () => {
  localStorage.removeItem(AUTH_KEYS.accessToken)
  localStorage.removeItem(AUTH_KEYS.refreshToken)
}

const refreshTokens = async (refreshToken: string): Promise<unknown> => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: AUTH_HEADERS,
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url

  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  // ⛔ НИКОГДА не рефрешим токен для auth эндпоинтов
  if (AUTH_URLS.some(x => url.includes(x))) {
    return result
  }

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)

        if (!refreshToken) {
          clearStoredTokens()
          return result
        }

        const refreshResult = await refreshTokens(refreshToken)

        if (isTokens(refreshResult)) {
          localStorage.setItem(AUTH_KEYS.accessToken, refreshResult.accessToken)
          localStorage.setItem(AUTH_KEYS.refreshToken, refreshResult.refreshToken)

          // повторяем оригинальный запрос с новым токеном
          result = await baseQuery(args, api, extraOptions)
        } else {
          clearStoredTokens()
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
