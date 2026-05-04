import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import Signup from './components/Signup'
import Login from './components/Login'
import Homefeed from './components/Homefeed'
import AuthCheck from './components/AuthCheck'
import UploadVideo from './components/UploadVideo'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Homefeed />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path:'/upload',
                element:<UploadVideo/>
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <AuthCheck>
                <RouterProvider router={router} />
            </AuthCheck>
        </Provider>
    </StrictMode>
)