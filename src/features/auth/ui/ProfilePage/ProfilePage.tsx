import { useGetMeQuery } from '@/features/auth/api/authApi.ts';
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx';
import {useFetchPlaylistsQuery} from '@/features/playlists/api/playlistsApi.ts';
import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList.tsx';
import { Navigate} from'react-router-dom';
import { Path} from '@/common/routing/Routing.tsx';
import s from './ProfilePage.module.css'
import type { PlaylistDataView } from '@/features/playlists/api/playlistsApi.types.ts';

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery(undefined)

  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    { userId: meResponse?.userId },
    { skip: !meResponse?.userId }
  )

  const playlists: PlaylistDataView[] = (playlistsResponse?.data || []).map(playlist => ({
    ...playlist,
    attributes: {
      ...playlist.attributes,
      description: playlist.attributes.description ?? '',
    },
  }))

  if (isLoading || isMeLoading) return <h1>Skeleton loader...</h1>
  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />
  return (
    <>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList
          playlists={playlists}
          isPlayListsLoading={isLoading || isMeLoading}
        />
      </div>
    </>
  )
}
