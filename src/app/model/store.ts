import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { playlistsApi } from '@/features/playlists/api/playlistsApi.ts'

export const store = configureStore({
  reducer: {
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(playlistsApi.middleware),
})

setupListeners(store.dispatch)