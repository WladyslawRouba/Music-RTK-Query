import { toast } from'react-toastify';
import defaultCover from '@/assets/images/default-playlist-cover.png';
import type { ChangeEvent } from 'react';
import {
  useDeletePlaylistCoverMutation,
  useUploadPlaylistCoverMutation,
} from '@/features/playlists/api/playlistsApi.ts';
import type { Images } from '@/common/types';
import s from './PlaylistCover.module.css';

type Props = {
  playlistId: string;
  images: Images
}

export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalCover = images.main.find(img => img.type === 'original')


  const src = originalCover ? originalCover.url : defaultCover

  const uploadCoverHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 // 1MB
    const allowedTypes = [ 'image/jpg', 'image/gif', 'image/png']

    const file = event.target.files?.length && event.target.files[0]
    if (!file) return

    if(file.size > maxSize) {
      toast(`The file is too large. Max size is ${Math.round(maxSize / 1024)}KB`,{type: 'error',theme: 'colored'})
    }

    if(allowedTypes.includes(file.type)) {
      toast('Only jpg, gif, and png files are allowed',{type: 'error' ,theme: 'colored'})
      return
    }
    uploadPlaylistCover({ playlistId: playlistId, file })
  }
  const deleteCoverHandler = ()=> deletePlaylistCover( {playlistId: playlistId})

  return (
<>
  <img src={src} alt="Cover" width={'240px'} className={s.cover} />
  <input type='file' accept={'image/jpg, image/gif, image/png'} onChange={uploadCoverHandler} />
  {originalCover && <button onClick={deleteCoverHandler}>Delete cover</button>}
</>
  )
}