import type { PlaylistAttributesView } from '@/features/playlists/api/playlistsApi.types.ts';

type Props = {
  attributes: PlaylistAttributesView
}

export const PlaylistDescription = ({attributes}: Props) => {
  return (
   <>
     <div>title: {attributes.title}</div>
     <div>description: {attributes.description ?? ''}</div>
     <div>userName: {attributes.user.name}</div>
   </>
  )
}
