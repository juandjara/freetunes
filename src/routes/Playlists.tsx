import { usePlayerReducer, Playlist } from '@/components/PlayerContext'
import { buttonCN } from '@/styles'
import { PencilSimple, Play, Playlist as PlaylistIcon, X } from 'phosphor-react'
import { useOutletContext } from 'react-router-dom'
import { ListItem } from './Search'

export default function Playlists() {
  const { state, actions } = useOutletContext<ReturnType<typeof usePlayerReducer>>()

  function createPlaylist() {
    const name = window.prompt('Nombre de la playlist')
    if (name && !!name.trim()) {
      actions.CREATE_PLAYLIST(name)
    }
  }

  function renamePlaylist(playlist: Playlist) {
    const newName = window.prompt('Nuevo nombre de la playlist', playlist.title)
    if (newName && !!newName.trim()) {
      actions.RENAME_PLAYLIST({
        id: playlist.id,
        title: newName
      })
    }
  }

  function removePlaylist(playlist: Playlist) {
    const confirmed = window.confirm('¿Estas seguro de que quieres borrar esta playlist?')
    if (confirmed) {
      actions.REMOVE_PLAYLIST(playlist)
    }
  }

  const playlistsUI = (
    <>
      {state.playlists.map((p, i) => (
        <div key={i} className='mx-2'>
          <div className='border-b-2 border-gray-200 flex items-end justify-between gap-2'>
            <p className='text-xl text-gray-500 pt-8'>{p.title}</p>
            <div className='flex-grow'></div>
            <button
              title='Reproducir playlist'
              disabled={p.items.length === 0}
              onClick={() => actions.PLAY_PLAYLIST(p)}
              className={`${buttonCN.shadow} ${buttonCN.primary} disabled:opacity-50 p-2 rounded-md mb-1`}
            >
              <Play size={20} weight='fill' />
            </button>
            <button
              title='Editar nombre'
              onClick={() => renamePlaylist(p)}
              className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded-md mb-1`}
            >
              <PencilSimple size={20} weight='fill' />
            </button>
            <button
              title='Eliminar playlist'
              onClick={() => removePlaylist(p)}
              className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded-md mb-1`}
            >
              <X size={20} weight='bold' />
            </button>
          </div>
          <ul className='space-y-8 my-4'>
            {p.items.length === 0 && <li>No hay canciones en esta playlist</li>}
            {p.items.map((s) => (
              <ListItem item={s} key={s.id} removeButton playlist={p} />
            ))}
          </ul>
        </div>
      ))}
      <div className='py-8'>
        <button
          onClick={createPlaylist}
          className={`block mx-auto rounded-md ${buttonCN.shadow} ${buttonCN.primary} ${buttonCN.normal}`}
        >
          Crear playlist
        </button>
      </div>
    </>
  )

  if (!state.queue.length) {
    return (
      <>
        <div className='text-center my-8 text-gray-500 px-3'>
          <PlaylistIcon
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
