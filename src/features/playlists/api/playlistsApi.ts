
import { baseApi} from '@/app/api/baseApi.ts'
import type { Images } from '@/common/types/types.ts';
import type {
  PlaylistsResponse,
UpdatePlaylistArgs,
  PlaylistData,
  CreatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts';

export const playlistsApi = baseApi.injectEndpoints({
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
      invalidatesTags: ['Playlists']
    }),
    deletePlaylistCover: build.mutation<void,  {playlistId: string } >({
      query: ({ playlistId })  => {
        return {
          url: `playlists/${playlistId}/images/main`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Playlists']

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


