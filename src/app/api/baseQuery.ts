import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTH_KEYS } from '@/common/constants'

const endpointsWithoutApiKey = new Set(['login', 'logout'])
const endpointsWithoutAccessToken = new Set(['login', 'logout'])

export const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    if (!endpointsWithoutApiKey.has(endpoint)) {
      headers.set('API-KEY', import.meta.env.VITE_API_KEY)
    }

    const token = localStorage.getItem(AUTH_KEYS.accessToken)

    if (token && !endpointsWithoutAccessToken.has(endpoint)) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})
