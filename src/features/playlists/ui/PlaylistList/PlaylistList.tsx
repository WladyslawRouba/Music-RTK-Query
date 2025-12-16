import s from './PlaylistList.module.css';
import { EditPlaylistForm } from '@/features/playlists/ui/EditPlaylistForm/EditPlaylistForm.tsx';
import { PlaylistItem } from '@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx';
import { useForm } from 'react-hook-form';
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts';
import { useState } from 'react';
import { useDeletePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts';

type Props = {
  playlists: PlaylistData[];
  isPlayListsLoading: boolean;
}

export const PlaylistList = ({ playlists, isPlayListsLoading }: Props) => {

  const { reset, register, handleSubmit } = useForm<UpdatePlaylistArgs>()
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [ deletePlaylist] = useDeletePlaylistMutation()


  const deletePlaylistHandler = (playlistId: string) => {
    if(confirm(`Are you sure you want to delete this playlist?`)) {
      deletePlaylist( playlistId)
    }
  }

  const editPlaylistHandler = (playlist: null | PlaylistData) => {
    if(playlist){
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map(tag => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }


  return (
    <div className={s.items}>
      {!playlists.length && !isPlayListsLoading && <h2>Playlists not found</h2>}
      {playlists.map(playlist => {
        const isEditing = playlist.id === playlistId
        return (

          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlaylistForm
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                editPlaylist={editPlaylistHandler}
                register={register}
                handleSubmit={handleSubmit}
              />
              ) : (
              <PlaylistItem
                playlist={playlist}
                deletePlaylistHandler={deletePlaylistHandler}
                editPlaylistHandler={editPlaylistHandler}
              />
              )
            }
          </div>

        )

      })}
    </div>
  )
}