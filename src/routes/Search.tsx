import { API_URL, INVIDIOUS_URL } from '@/config'
import { CloudArrowDown, DotsThree, ListPlus, Play, X } from 'phosphor-react'
import { json, LoaderFunction, useLoaderData, useOutletContext, useSearchParams } from 'react-router-dom'
import { buttonCN } from '@/styles'
import { usePlayerReducer } from '@/components/PlayerContext'

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

export function ListItem({ item, removeButton = false }: { item: SearchResult; removeButton?: boolean }) {
  const { actions } = useOutletContext<ReturnType<typeof usePlayerReducer>>()
  return (
    <li key={item.id} className='relative mx-3 md:flex items-center justify-start'>
      {removeButton ? (
        <button
          title='Remove from list'
          onClick={() => actions.REMOVE_FROM_QUEUE(item)}
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
          <Play size={20} />
        </button>
        <a
          href={`${API_URL}/dl/${item.id}`}
          download={item.title}
          title='Descargar'
          className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}
        >
          <CloudArrowDown size={20} />
        </a>
        <button
          title='Añadir a la cola'
          onClick={() => actions.ADD_TO_QUEUE(item)}
          className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}
        >
          <ListPlus size={20} />
        </button>
        <button
          title='Añadir a ...'
          className={`${buttonCN.shadow} ${buttonCN.primary} p-2 rounded`}
        >
          <DotsThree size={20} />
        </button>
      </div>
      <p className='text-center'>{item.title}</p>
    </li>
  )
}
