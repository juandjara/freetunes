import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Playlists from './routes/Playlists'
import Search, { loader as searchLoader } from './routes/Search'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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

function App() {
  return <RouterProvider router={router} />
}

export default App
