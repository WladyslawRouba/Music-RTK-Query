
import {  useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts';
import s from './PlaylistsPage.module.css'

import { useState } from'react';
import { useDebounceValue } from '@/common/hooks/useDebounceValue';
  import { Pagination } from '@/common/components'
import type { ChangeEvent } from 'react';
import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList.tsx';
import type { PlaylistDataView } from '@/features/playlists/api/playlistsApi.types.ts';



export const PlaylistsPage = () => {

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);


  const debounceSetSearch = useDebounceValue(search)

  const { data, isLoading} = useFetchPlaylistsQuery({
    search: debounceSetSearch,
    pageNumber: currentPage,
    pageSize
  })





  const setPageSizeHandler = (pageSize: number) => {
    setCurrentPage(1)
    setPageSize(pageSize)
  }
  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  const playlists: PlaylistDataView[] = (data?.data || []).map(playlist => ({
    ...playlist,
    attributes: {
      ...playlist.attributes,
      description: playlist.attributes.description ?? '',
    },
  }))

if (isLoading) return <div>Skeleton loading ...</div>
  return (
    <div className={s.container}>
      <h1>Playlists page</h1>

      <input type="search"
             placeholder="Search playlists by title"
             onChange={e => searchPlaylistHandler(e)}
      />
      <PlaylistList isPlayListsLoading={isLoading} playlists={playlists} />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={setPageSizeHandler}
      />
    </div>

  )
}
