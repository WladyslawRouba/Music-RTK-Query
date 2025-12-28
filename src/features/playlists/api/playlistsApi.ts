
import { baseApi} from '@/app/api/baseApi.ts'
import type { Images } from '@/common/types/types.ts';
import type {
  PlaylistsResponse,
  UpdatePlaylistArgs,
  PlaylistData,
  CreatePlaylistArgs, FetchPlaylistsArgs,
} from '@/features/playlists/api/playlistsApi.types.ts';

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs  >({
query: (params) => ({url :'playlists', params, }),
  providesTags: ['Playlist'],
}),
    createPlaylist: build.mutation<{data : PlaylistData}, CreatePlaylistArgs >({
      query: (body)  => {
        return {
          url: 'playlists',
          method: 'POST',
          body
        }
      },
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


