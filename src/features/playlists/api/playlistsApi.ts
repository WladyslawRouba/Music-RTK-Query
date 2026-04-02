import { baseApi } from '@/app/api/baseApi'
import type { Images } from '@/common/types/types'
import type { CreatePlaylistArgs, FetchPlaylistsArgs, UpdatePlaylistArgs } from './playlistsApi.types'
import { playlistCreateResponseSchema, playlistsResponseSchema } from '@/features/playlists/model/playlists.schemas'
import { imagesSchema } from '@/common/schemas'
import { withZodCatch } from '@/common/utils/withZodCatch'

const toPlaylistJsonApiBody = (attributes: CreatePlaylistArgs | UpdatePlaylistArgs) => ({
  data: {
    type: 'playlists',
    attributes,
  },
})

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: 'playlists', params }),
      ...withZodCatch(playlistsResponseSchema),
      providesTags: ['Playlist'],
      keepUnusedDataFor: 60,
    }),

    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
        url: 'playlists',
        method: 'POST',
        body: toPlaylistJsonApiBody(body),
      }),
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ['Playlist'],
    }),

    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ url: `playlists/${playlistId}`, method: 'DELETE' }),
      invalidatesTags: ['Playlist'],
    }),

    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        url: `playlists/${playlistId}`,
        method: 'PUT',
        body: toPlaylistJsonApiBody(body),
      }),
      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')
        const patchResults: any[] = []

        args.forEach(arg => {
          patchResults.push(dispatch(
            playlistsApi.util.updateQueryData('fetchPlaylists', { ...arg }, state => {
              const index = state.data.findIndex(p => p.id === playlistId)
              if (index !== -1) {
                state.data[index].attributes = {
                  ...state.data[index].attributes,
                  title: body.title,
                  description: body.description ?? state.data[index].attributes.description,
                }
              }
            })
          ))
        })

        try { await queryFulfilled }
        catch { patchResults.forEach(p => p.undo()) }
      },
      invalidatesTags: ['Playlist'],
    }),

    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { url: `playlists/${playlistId}/images/main`, method: 'POST', body: formData }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlist'],
    }),

    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ url: `playlists/${playlistId}/images/main`, method: 'DELETE' }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi
