import { baseApi } from '@/app/api/baseApi'
import type{ MeResponse } from './authApi.types.ts'

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
    }),
  }),
})

export const { useGetMeQuery } = authApi