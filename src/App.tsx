import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom'
import Layout from './components/Layout'
import Playlists from './routes/Playlists'
import Search, { loader as searchLoader } from './routes/Search'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Playlists />
      },
      {
        path: '/search',
        element: <Search />,
        loader: searchLoader
      }
    ]
  }
])

function ErrorPage() {
  const error = useRouteError() as Error
  console.error(error)

  return (
    <div className='min-h-screen grid place-content-center text-center'>
      <h1 className='text-4xl my-4'>Oops!</h1>
      <p className=''>Mis disculpas. Algo se ha roto en alguna parte 😰</p>
      <p className='max-w-screen-md bg-white p-3 my-4 rounded-md'>
        <i>{error.message}</i>
      </p>
    </div>
  )
}

function App() {
  return <RouterProvider router={router} />
}

export default App
