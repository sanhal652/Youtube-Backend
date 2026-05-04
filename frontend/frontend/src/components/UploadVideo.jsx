import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { uploadVideo } from '@/axiosFiles/videoApi'
import { addVideo } from '../store/videoSlice'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function UploadVideo() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit } = useForm()
    const [successMsg, setSuccessMsg] = useState(null)
    const uploadVideoHandler = async (data) => {
        setError(null)
        setLoading(true)
        setSuccessMsg(null)
        try {
            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("videoFile", data.videoFile[0])
            formData.append("thumbnail", data.thumbnail[0])
            const response = await uploadVideo(formData)
            if (response.success) {
                const newVideo = response.data.video || response.data;
                console.log("New video added:", newVideo)
                dispatch(addVideo(newVideo))
                setSuccessMsg("Video uploaded successfully!")
                setTimeout(() => {
                    navigate("/")
                }, 2000)

            }
        } catch (error) {
            setError("Failed to upload video. Please try again.")
        } finally {
            setLoading(false)
        }


    }
    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
                    <p className="text-gray-500 text-sm mt-1">Share your video with the world</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Success */}
                {successMsg && (
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm text-center">✅ {successMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(uploadVideoHandler)}>
                    <div className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter video title"
                                className="w-full border-gray-300 focus:ring-2 focus:ring-red-500"
                                {...register("title", { required: true })}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Enter video description"
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                {...register("description", { required: true })}
                            />
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thumbnail <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 transition-colors">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                    {...register("thumbnail", { required: true })}
                                />
                            </div>
                        </div>

                        {/* Video File */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video File <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 transition-colors">
                                <Input
                                    type="file"
                                    accept="video/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                    {...register("videoFile", { required: true })}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md active:scale-[0.98] ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Uploading... Please wait" : "Upload Video →"}
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    )

}

export default UploadVideo