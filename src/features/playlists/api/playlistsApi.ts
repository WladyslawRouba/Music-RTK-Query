
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  PlaylistsResponse,
UpdatePlaylistArgs,
  PlaylistData,
  CreatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts';

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  tagTypes: ['Playlists'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,

    prepareHeaders : (headers)=> {
      headers.set('API-KEY', import.meta.env.VITE_API_KEY)
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
}
  }),
  endpoints: (build) => ({
fetchPlaylists: build.query<PlaylistsResponse, void  >({
query: () =>  'playlists',
  providesTags: ['Playlists']
}),
    createPlaylist: build.mutation<{data : PlaylistData}, CreatePlaylistArgs >({
      query: (body)  => {
        return {
          url: 'playlists',
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Playlists']
    }),
    deletePlaylist: build.mutation<void, string >({
      query: (playlistId)  => {
        return {
          url: `playlists/${playlistId}`,
          method: 'DELETE',

        }
      },
      invalidatesTags: ['Playlists']
    }),
    updatePlaylist: build.mutation<void, { playlistId: string, body: UpdatePlaylistArgs  } >({
      query: ({playlistId, body})  => {
        return {
          url: `playlists/${playlistId}`,
          body,
          method: 'PUT',

        }
      },
      invalidatesTags: ['Playlists']

    })
  })
})

export const {useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation} = playlistsApi