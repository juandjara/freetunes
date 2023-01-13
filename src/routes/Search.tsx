import { API_URL, INVIDIOUS_URL } from '@/config'
import { CloudArrowDown, DotsThree, DownloadSimple, ListPlus, Play, X } from 'phosphor-react'
import { json, LoaderFunction, useLoaderData, useOutletContext, useSearchParams } from 'react-router-dom'
import { buttonCN } from '@/styles'
import { Playlist, usePlayerReducer } from '@/components/PlayerContext'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export type SearchResult = {
  id: string
  title: string
  lengthSeconds: number
  image: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URL(request.url).searchParams.get('q')
  if (!query) {
    return { results: [] }
  }

  const res = await fetch(`${INVIDIOUS_URL}/api/v1/search?q=${query}`)
  const data = await res.json()
  const parsed = data.map((d: any) => {
    return {
      id: d.videoId,
      title: d.title,
      lengthSeconds: d.lengthSeconds,
      image: `https://i.ytimg.com/vi/${d.videoId}/mqdefault.jpg`
    }
  })

  return json<SearchResult[]>(parsed)
}

export default function Search() {
  const data = useLoaderData() as SearchResult[]
  return (
    <ul className='space-y-8 my-4'>
      {data.map((item) => (
        <ListItem item={item} key={item.id} />
      ))}
    </ul>
  )
}

type ListItemProps = {
  item: SearchResult
  removeButton?: boolean
  playlist?: Playlist
}

export function ListItem({ item, removeButton = false, playlist }: ListItemProps) {
  const { state, actions } = useOutletContext<ReturnType<typeof usePlayerReducer>>()

  function removeItem() {
    if (playlist) {
      actions.REMOVE_FROM_PLAYLIST({ song: item, playlist })
    } else {
      actions.REMOVE_FROM_QUEUE(item)
    }
  }

  return (
    <li key={item.id} className='relative mx-3 md:flex items-center justify-start'>
      {removeButton ? (
        <button
          title='Remove from list'
          onClick={removeItem}
          className={`absolute -top-2 -left-2 p-1 rounded-md ${buttonCN.shadow} ${buttonCN.primary}`}
        >
          <X size={16} weight='bold' />
        </button>
      ) : null}
      <img alt='video thumbnail' className='mx-auto md:mx-0 rounded w-72' src={item.image} />
      <div className='my-3 mx-4 flex items-center justify-center space-x-3'>
        <button
          title='Reproducir'
          onClick={() => {
            actions.PLAY_SONG(item)
          }}
          className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}
        >
          <Play size={20} weight='fill' />
        </button>
        <a
          href={`${API_URL}/dl/${item.id}`}
          download={item.title}
          title='Descargar'
          className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}
        >
          <DownloadSimple size={20} weight='fill' />
        </a>
        <button
          title='Añadir a la cola'
          onClick={() => actions.ADD_TO_QUEUE(item)}
          className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}
        >
          <ListPlus size={20} weight='fill' />
        </button>
        {state.playlists.length ? (
          <Menu as='div' className='relative'>
            <Menu.Button title='Añadir a ...' className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}>
              <DotsThree size={20} weight='fill' />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                as='ul'
                className='absolute z-20 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
              >
                <li>
                  <p className='px-4 py-2'>Añadir a playlist</p>
                </li>
                {state.playlists.map((p) => (
                  <Menu.Item key={p.id} as='li'>
                    <button
                      onClick={() => actions.ADD_TO_PLAYLIST({ song: item, playlist: p })}
                      className={`hover:bg-gray-100 w-full text-left rounded-md ${buttonCN.normal} ${buttonCN.primary}`}
                    >
                      {p.title}
                    </button>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        ) : null}
      </div>
      <p className='text-center'>{item.title}</p>
    </li>
  )
}
