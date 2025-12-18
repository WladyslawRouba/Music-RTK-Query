
import {  useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts';
import s from './PlaylistsPage.module.css'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'

import { useState } from'react';

import { useDebounceValue } from '@/common/hooks/useDebounceValue';
  import { Pagination } from '@/common/components'
import type { ChangeEvent } from 'react';
import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList.tsx';

export const PlaylistsPage = () => {

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);


  const debounceSetSearch = useDebounceValue(search)

  const { data, isLoading } = useFetchPlaylistsQuery({
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

  return (

    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input type="search"
             placeholder="Search playlists by title"
             onChange={e => searchPlaylistHandler(e)}
      />
      <PlaylistList isPlayListsLoading={isLoading} playlists={data?.data || []} />
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
