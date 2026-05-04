//component is added to keep the user logged in even after refreshing the page. 
// It checks if the user is already logged in by making an API call to get the current user details. 
// If the user is logged in, it dispatches the login action to update the Redux store with the user's information. This way, the user's authentication state is preserved across page reloads.

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../axiosFiles/userApi'
import { login } from '../store/authSlice'

const AuthCheck = ({ children }) => {
    const dispatch = useDispatch()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getCurrentUser()
                if (response.success) {
                    dispatch(login(response.data))
                }
            } catch (error) {
                // user not logged in, do nothing
            }
        }
        checkAuth()
    }, [])

    return children
}

export default AuthCheck