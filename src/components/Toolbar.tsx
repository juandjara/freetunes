import { MagnifyingGlass, Playlist } from 'phosphor-react'
import { buttonCN, inputCN } from '@/styles'
import { useEffect, useMemo, useState } from 'react'
import debounce from 'just-debounce'
import { API_URL } from '@/config'
import { Form, Link, useLocation } from 'react-router-dom'

export default function Toolbar({ count }: { count: number }) {
  const loc = useLocation()
  const initialQuery = new URLSearchParams(loc.search).get('q') || ''
  const playlistActive = loc.pathname === '' || loc.pathname === '/'
  const toggleCN = playlistActive ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-gray-400'
  const [query, setQuery] = useState('')
  const handleSearch = useMemo(() => debounce(setQuery, 300), [])
  const [suggestions, setSuggestions] = useState([] as string[])

  useEffect(() => {
    let isMounted = true
    if (query) {
      fetch(`${API_URL}/autocomplete?q=${query}`)
        .then((res) => res.text())
        .then((data) => {
          try {
            const cleantext = String(data).replace(/^.+\(/, '').replace(')', '')
            const json = JSON.parse(cleantext)
            return json[1].map((item: any) => item[0]) as string[]
          } catch (err) {
            return []
          }
        })
        .then((list) => {
          if (isMounted) {
            setSuggestions(list)
          }
        })
    } else {
      setSuggestions([])
    }

    return () => {
      isMounted = false
    }
  }, [query])

  return (
    <div className='border-b border-gray-300 gap-3 flex items-end justify-between relative'>
      <Link
        to='/'
        className={`${toggleCN} ${buttonCN.normal} ${buttonCN.iconLeft} rounded-t-md hover:bg-gray-200 border-b-2 relative`}
      >
        <Playlist weight='fill' size={20} />
        <p>Playlists</p>
        {count ? (
          <span className='flex items-center justify-center z-10 absolute -top-2 -right-2 bg-green-500 text-white rounded-full text-sm w-5 h-5 leading-none'>
            {count}
          </span>
        ) : null}
      </Link>
      <Form
        action='/search'
        method='get'
        style={{ willChange: 'width' }}
        className='absolute right-0 bottom-0 focus-within:mr-0 mr-1 focus-within:mb-0 mb-1 md:focus-within:w-96 focus-within:w-full w-60 transition-all duration-300'
      >
        <div>
          <input
            id='q'
            type='text'
            name='q'
            list='q-autocomplete'
            placeholder='Busca canciones en youtube'
            className={`${inputCN} pr-8 text-sm`}
            onChange={(ev) => handleSearch(ev.target.value)}
            defaultValue={initialQuery}
          />
          <label htmlFor='q' className='absolute top-2 right-2 text-gray-500'>
            <MagnifyingGlass size={20} weight='bold' />
          </label>
          <datalist id='q-autocomplete'>
            {suggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
      </Form>
    </div>
  )
}
