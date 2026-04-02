import { baseApi } from '@/app/api/baseApi'
import { AUTH_KEYS } from '@/common/constants'
import { meResponseSchema, loginResponseSchema } from '@/features/auth/model/auth.schemas'
import { withZodCatch } from '@/common/utils'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { LoginArgs, LoginResponse, MeResponse } from './authApi.types'

const authHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const createAuthError = async (response: Response): Promise<FetchBaseQueryError> => {
  let data: unknown = null

  try {
    data = await response.json()
  } catch {
    data = null
  }

  return {
    status: response.status,
    data,
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => 'auth/me',
      ...withZodCatch(meResponseSchema),
      providesTags: ['Auth'],
    }),

    login: build.mutation<LoginResponse, LoginArgs>({
      async queryFn(payload) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ ...payload, accessTokenTTL: '3m' }),
          })

          if (!response.ok) {
            return { error: await createAuthError(response) }
          }

          return { data: await response.json() }
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Network error',
            },
          }
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
          localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
          dispatch(authApi.util.invalidateTags(['Auth']))
        } catch {
          // Ошибка запроса уже попадает в RTK Query state, повторно падать тут не нужно.
        }
      },
      ...withZodCatch(loginResponseSchema),
    }),

    logout: build.mutation<void, void>({
      async queryFn() {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ refreshToken }),
          })

          if (!response.ok) {
            return { error: await createAuthError(response) }
          }

          return { data: undefined }
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error instanceof Error ? error.message : 'Network error',
            },
          }
        }
      },
      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try { await queryFulfilled } catch { /* игнорируем */ }
        finally {
          localStorage.removeItem(AUTH_KEYS.accessToken)
          localStorage.removeItem(AUTH_KEYS.refreshToken)
          dispatch(baseApi.util.resetApiState())
        }
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi
