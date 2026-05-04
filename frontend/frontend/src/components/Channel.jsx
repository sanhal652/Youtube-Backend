import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
function Channel() {
    const {username} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading,setLoading]= useState(false)
    const [error,setError]= useState(null)
    const [channelData,setChannelData]= useState(null)
    const getChannelDetails= async()=>{
        setLoading(true)
        setError(null)
        try {
            const response= await getUserChannelProfile(username)
            if(response.success){
                setChannelData(response.data)
                navigate(`/channel/${userData?.username}`)
            }
        } catch (error) {
            setError(error)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div>Channel</div>
  )
}

export default Channel