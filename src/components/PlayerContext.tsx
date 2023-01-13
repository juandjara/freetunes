import { SearchResult } from '@/routes/Search'
import { useEffect, useReducer } from 'react'

const STORAGE_KEY = 'freetunes_state'
const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
const defaultState = {
  queue: [] as SearchResult[],
  index: -1
}
const initialState = savedState || defaultState

type PlayerState = typeof defaultState
type Action = {
  type: string
  payload?: SearchResult
}

export const PLAYER_ACTIONS = {
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  PLAY_SONG: 'PLAY_SONG',
  NEXT_SONG: 'NEXT_SONG',
  PREV_SONG: 'PREV_SONG'
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
        queue: [payload].concat(state.queue.filter((s) => s.id !== payload.id)),
        index: 0
      }
    case PLAYER_ACTIONS.NEXT_SONG:
      return nextSong(state)
    case PLAYER_ACTIONS.PREV_SONG:
      return prevSong(state)
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
    actions[actionKey as ActionKeys] = (payload) => {
      dispatch({ type: actionKey, payload })
    }
  }

  return { state, actions }
}
