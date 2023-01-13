import { Link, Outlet } from 'react-router-dom'
import Toolbar from './Toolbar'
import logo from '@/assets/note.png'
import Player from './Player'
import { usePlayerReducer } from './PlayerContext'
import GlobalSpinner from './GlobalSpiner'

export default function Layout() {
  const { state, actions } = usePlayerReducer()
  return (
    <>
      <GlobalSpinner />
      <header className='text-center mb-8'>
        <Link to='/' className='block mx-auto'>
          <img className='w-16 h-16 mx-auto block my-8' src={logo} alt='' />
          <h1 className='text-3xl mb-2'>FreeTunes</h1>
          <h2 className='text-2xl font-light text-gray-500'>Tu musica de fondo</h2>
        </Link>
      </header>
      <main className='max-w-screen-lg mx-auto my-4'>
        <Toolbar count={state.queue.length} />
        <div className='mb-16'>
          <Outlet context={{ state, actions }} />
        </div>
        <Player state={state} actions={actions} />
      </main>
    </>
  )
}
