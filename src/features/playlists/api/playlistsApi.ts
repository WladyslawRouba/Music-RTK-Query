
import { baseApi} from '@/app/api/baseApi.ts'
import type { Images } from '@/common/types/types.ts';
import type {
  UpdatePlaylistArgs,
  CreatePlaylistArgs, FetchPlaylistsArgs,
} from '@/features/playlists/api/playlistsApi.types.ts';
import { playlistCreateResponseSchema, playlistsResponseSchema } from '@/features/playlists/model/playlists.schemas.ts';

import { imagesSchema } from '@/common/schemas';
import { withZodCatch } from '@/common/utils/withZodCatch.ts';

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
fetchPlaylists: build.query({
query: (params: FetchPlaylistsArgs) => ({url :'playlists', params, }),
 ...withZodCatch(playlistsResponseSchema),
  providesTags: ['Playlist'],
}),
    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs)  => {
        return {
          url: 'playlists',
          method: 'POST',
          body
        }
      },
        ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ['Playlist']
    }),
    deletePlaylist: build.mutation<void, string >({
      query: (playlistId)  => {
        return {
          url: `playlists/${playlistId}`,
          method: 'DELETE',

        }
      },
      invalidatesTags: ['Playlist']
    }),

    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ url: `playlists/${playlistId}`, method: 'put', body }),
      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchResults: any[] = []

        args.forEach(arg => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData(
                'fetchPlaylists',
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search,
                },
                state => {
                  const index = state.data.findIndex(playlist => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                }
              )
            )
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach(patchResult => {
            patchResult.undo()
          })
        }
      },
      invalidatesTags: ['Playlist'],
    }),


    uploadPlaylistCover: build.mutation< Images, { playlistId: string, file: File  }>({
      query: ({playlistId, file})  => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `playlists/${playlistId}/images/main`,
          body: formData,
          method: 'POST',
        }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ['Playlist']
    }),
    deletePlaylistCover: build.mutation<void,  {playlistId: string } >({
      query: ({ playlistId })  => {
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Playlist']

    }),
  })
})
export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
useDeletePlaylistCoverMutation
} = playlistsApi


