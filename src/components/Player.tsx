import { API_URL } from '@/config'
import { buttonCN } from '@/styles'
import { FastForward, Pause, Play, Rewind } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { usePlayerReducer } from './PlayerContext'
import Slider from './Slider'

type PlayerProps = {
  state: ReturnType<typeof usePlayerReducer>['state']
  actions: ReturnType<typeof usePlayerReducer>['actions']
}

export default function Player({ state, actions }: PlayerProps) {
  const { queue, index } = state
  const song = queue[index]
  const audioRef = useRef<HTMLAudioElement>(null)

  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const duration = song?.lengthSeconds || 0

  function setTime(time: number) {
    audioRef.current?.fastSeek(time)
  }

  function formatTime(totalSeconds: number, position: number) {
    if (position > 0 && !totalSeconds) {
      return '-- : --'
    }

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds - minutes * 60)

    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  useEffect(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
    }
  }, [song])

  const hasNext = queue.length - 1 > index
  const hasPrev = index > 0

  return (
    <div className='fixed bottom-0 inset-x-0 px-3 py-2 bg-green-600 text-white'>
      {song ? (
        <audio
          ref={audioRef}
          preload='auto'
          src={`${API_URL}/stream/${song.id}`}
          onTimeUpdate={(ev) => setCurrentTime((ev.target as HTMLAudioElement).currentTime)}
          onPause={() => setPaused(true)}
          onPlay={() => setPaused(false)}
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
        />
      ) : null}
      <Slider min={0} max={duration} step={1} value={currentTime} onChange={setTime} />
      <div className='flex gap-2 justify-start items-center'>
        <p className='font-medium tabular-nums text-lg md:mr-1 flex-shrink-0'>
          {formatTime(currentTime, 0)}
          <span className='font-light'> / </span>
          {formatTime(duration, 1)}
        </p>
        <p className='flex-shrink truncate'>{song?.title}</p>
        <div className='flex-grow'></div>
        <div className='flex-shrink-0'>
          <button
            disabled={!hasPrev}
            onClick={() => actions.PREV_SONG()}
            className={`${buttonCN.shadow} p-2 rounded-full disabled:opacity-50`}
          >
            <Rewind size={24} weight='fill' />
          </button>
          <button
            onClick={() => (paused ? audioRef.current?.play() : audioRef.current?.pause())}
            className={[
              'p-3 rounded-full mx-2',
              buttonCN.primary,
              buttonCN.shadow,
              song && loading ? 'play-btn-loading' : ''
            ].join(' ')}
          >
            {paused ? <Play size={20} weight='fill' /> : <Pause size={20} weight='fill' />}
          </button>
          <button
            disabled={!hasNext}
            onClick={() => actions.NEXT_SONG()}
            className={`${buttonCN.shadow} p-2 rounded-full disabled:opacity-50`}
          >
            <FastForward size={24} weight='fill' />
          </button>
        </div>
      </div>
    </div>
  )
}
