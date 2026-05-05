import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'
import { userLogout } from '@/axiosFiles/userApi'
import { Button } from "@/components/ui/button";
function Logout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [success, setSuccess] = useState(null)
    const logoutHandler = async() => {
        try {
            const response = await userLogout()
            if (response.success) {
                dispatch(logout())
                setSuccess("Logged out successfully!")
                setTimeout(() => {
                    navigate("/")
                }, 2000)
            }
        } catch (error) {
            console.log("Logout failed",error)
            dispatch(logout())
            navigate("/")
        }
    }
    return (
        <div><Button variant="outline" size="sm" className="hidden sm:flex" onClick={logoutHandler}>
            Logout
        </Button></div>
    )
}

export default Logout