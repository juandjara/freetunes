import { usePlayerReducer } from '@/components/PlayerContext'
import { buttonCN } from '@/styles'
import { Play, Playlist, X } from 'phosphor-react'
import { useOutletContext } from 'react-router-dom'
import { ListItem, SearchResult } from './Search'

export default function Playlists() {
  const { state } = useOutletContext<ReturnType<typeof usePlayerReducer>>()

  const playlists = [
    {
      title: 'Playlist 1',
      items: [] as SearchResult[]
    },
    {
      title: 'Playlist 2',
      items: [] as SearchResult[]
    },
    {
      title: 'Playlist 3',
      items: [] as SearchResult[]
    }
  ]
  const playlistsUI = (
    <>
      {playlists.map((p, i) => (
        <div key={i} className='mx-2'>
          <div className='border-b-2 border-gray-200 flex items-end justify-between gap-2'>
            <p className='text-xl text-gray-500 pt-8'>{p.title}</p>
            <div className='flex-grow'></div>
            <button
              title='Reproducir playlist'
              className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded mb-1`}
            >
              <Play size={20} />
            </button>
            <button
              title='Eliminar playlist'
              className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded mb-1`}
            >
              <X size={20} />
            </button>
          </div>
          <ul className='space-y-8 my-4'>
            {p.items.length === 0 && <li>No hay canciones en esta playlist</li>}
            {p.items.map((s) => (
              <ListItem item={s} key={s.id} removeButton />
            ))}
          </ul>
        </div>
      ))}
      <div className='py-8'>
        <button className={`block mx-auto ${buttonCN.shadow} ${buttonCN.primary} ${buttonCN.normal}`}>
          Crear playlist
        </button>
      </div>
    </>
  )

  if (!state.queue.length) {
    return (
      <>
        <div className='text-center my-8 text-gray-500 px-3'>
          <Playlist
            size={42}
            weight='fill'
            className='mx-auto shadow-md bg-gray-500 bg-opacity-50 text-gray-100 rounded-full p-2'
          />
          <p className='my-4'>
            La cola de reproducción esta vacia. Puedes añadir canciones usando la caja de busqueda.
          </p>
        </div>
        {playlistsUI}
      </>
    )
  }

  return (
    <>
      <p className='text-xl text-gray-500 border-b-2 border-gray-200 mx-2 pt-8'>Cola de reproduccion</p>
      <ul className='space-y-8 my-4'>
        {state.queue.map((s) => (
          <ListItem item={s} key={s.id} removeButton />
        ))}
      </ul>
      {playlistsUI}
    </>
  )
}
