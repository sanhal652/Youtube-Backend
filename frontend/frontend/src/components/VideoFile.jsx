import React,{useState} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function VideoFile() {
    const [videos,setVideos]= useState([])
    const[loading,setLoading]=useState(null)
    const[error,setError]= useState(null)
    const dispatch= useDispatch()
    const navigate= useNavigate()
    const getVideo= async()
  return (
    <div>VideoFile</div>
  )
}

export default VideoFile