import { SearchResult } from '@/routes/Search'
import { useEffect, useReducer } from 'react'

const STORAGE_KEY = 'freetunes_state'
const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
const defaultState = {
  playlists: [] as Playlist[],
  queue: [] as SearchResult[],
  index: -1
}
const initialState = savedState || defaultState

type Playlist = {
  id: number
  title: string
  items: SearchResult[]
}
type PlayerState = typeof defaultState
type Action =
  | { payload: SearchResult; type: 'ADD_TO_QUEUE' }
  | { payload: SearchResult; type: 'REMOVE_FROM_QUEUE' }
  | { payload: SearchResult; type: 'PLAY_SONG' }
  | { payload: undefined; type: 'NEXT_SONG' }
  | { payload: undefined; type: 'PREV_SONG' }
  | { payload: string; type: 'CREATE_PLAYLIST' }
  | { payload: { id: number; title: string }; type: 'RENAME_PLAYLIST' }
  | { payload: Playlist; type: 'REMOVE_PLAYLIST' }
  | { payload: Playlist; type: 'PLAY_PLAYLIST' }
  | { payload: { song: SearchResult; playlist: Playlist }; type: 'ADD_TO_PLAYLIST' }
  | { payload: { song: SearchResult; playlist: Playlist }; type: 'REMOVE_FROM_PLAYLIST' }

export const PLAYER_ACTIONS = {
  ADD_TO_QUEUE: 'ADD_TO_QUEUE' as const,
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE' as const,
  PLAY_SONG: 'PLAY_SONG' as const,
  NEXT_SONG: 'NEXT_SONG' as const,
  PREV_SONG: 'PREV_SONG' as const,
  CREATE_PLAYLIST: 'CREATE_PLAYLIST' as const,
  RENAME_PLAYLIST: 'RENAME_PLAYLIST' as const,
  REMOVE_PLAYLIST: 'REMOVE_PLAYLIST' as const,
  PLAY_PLAYLIST: 'PLAY_PLAYLIST' as const,
  ADD_TO_PLAYLIST: 'ADD_TO_PLAYLIST' as const,
  REMOVE_FROM_PLAYLIST: 'REMOVE_FROM_PLAYLIST' as const
}

function playerContextReducer(state: PlayerState, action: Action) {
  const { type, payload } = action
  const ids = new Set(state.queue.map((s) => s.id))
  switch (type) {
    case PLAYER_ACTIONS.ADD_TO_QUEUE:
      if (!payload || ids.has(payload.id)) {
        return state
      }
      return { ...state, queue: state.queue.concat(payload) }
    case PLAYER_ACTIONS.REMOVE_FROM_QUEUE:
      if (!payload || !ids.has(payload.id)) {
        return state
      }
      return { ...state, queue: state.queue.filter((s) => s.id !== payload.id) }
    case PLAYER_ACTIONS.PLAY_SONG:
      if (!payload) {
        return state
      }
      return {
        ...state,
        queue: [payload].concat(state.queue.filter((s) => s.id !== payload.id)),
        index: 0
      }
    case PLAYER_ACTIONS.NEXT_SONG:
      return nextSong(state)
    case PLAYER_ACTIONS.PREV_SONG:
      return prevSong(state)
    case PLAYER_ACTIONS.CREATE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.concat({
          id: state.playlists.length,
          title: payload,
          items: []
        })
      }
    case PLAYER_ACTIONS.RENAME_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === payload.id
            ? {
                ...p,
                title: payload.title
              }
            : p
        )
      }
    case PLAYER_ACTIONS.REMOVE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== payload.id)
      }
    case PLAYER_ACTIONS.PLAY_PLAYLIST:
      return {
        ...state,
        queue: payload.items.slice()
      }
    case PLAYER_ACTIONS.ADD_TO_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === payload.playlist.id
            ? {
                ...p,
                items: p.items.some((s) => s.id === payload.song.id) ? p.items : p.items.concat(payload.song)
              }
            : p
        )
      }
    case PLAYER_ACTIONS.REMOVE_FROM_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === payload.playlist.id
            ? {
                ...p,
                items: p.items.filter((s) => s.id !== payload.song.id)
              }
            : p
        )
      }
    default:
      return state
  }
}

function nextSong(state: PlayerState) {
  if (state.queue.length < 2) {
    return state
  }

  const nextIndex = state.index === state.queue.length - 1 ? 0 : state.index + 1
  return { ...state, index: nextIndex }
}

function prevSong(state: PlayerState) {
  if (state.queue.length < 2) {
    return state
  }

  const prevIndex = state.index === 0 ? state.queue.length - 1 : state.index - 1
  return { ...state, index: prevIndex }
}

type ActionKeys = keyof typeof PLAYER_ACTIONS

export function usePlayerReducer() {
  const [state, dispatch] = useReducer(playerContextReducer, initialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const actions = {} as Record<ActionKeys, (payload?: Action['payload']) => void>
  for (const actionKey of Object.values(PLAYER_ACTIONS)) {
    actions[actionKey] = (payload) => {
      dispatch({ type: actionKey, payload } as any)
    }
  }

  return { state, actions }
}
