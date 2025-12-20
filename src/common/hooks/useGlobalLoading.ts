import type { RootState } from '@/app/model/store.ts'
import { useSelector } from 'react-redux'

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {

    const queries = Object.values(state.baseApi.queries || {})
    const mutations = Object.values(state.baseApi.mutations || {})

    const hasActiveQueries = queries.some(query => query?.status === 'pending')
    const hasActiveMutations = mutations.some(mutation => mutation?.status === 'pending')

    return hasActiveQueries || hasActiveMutations
  })
}