import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateAccountDetails, updateAvatar, updateCoverImg } from '@/axiosFiles/userApi'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from '@/store/authSlice'
function EditChannel() {
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const dispatch = useDispatch()
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")

    const updateAccount = async () => {
        setLoading(true)
        try {
            if (fullName || email) {
                const response = await updateAccountDetails({
                    fullName: fullName || undefined,
                    email: email || undefined
                })
                dispatch(login(response.data))
            }
            if (avatar) {
                const avatarData = new FormData()
                avatarData.append("avatar", avatar)
                const response=await updateAvatar(avatarData)
                dispatch(login(response.data))
            }
            if (coverImage) {
                const coverImgData = new FormData()
                coverImgData.append("coverImage", coverImage)
                const response=await updateCoverImg(coverImgData)
                dispatch(login(response.data))
            }
            setSuccess("Account updated successfully!")
        } catch (error) {
            setError(`Account update failed:${error.message}`)
        } finally {
            setLoading(false)
        }
    }
   return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8 px-4">
            <div className="mx-auto w-full max-w-lg bg-white rounded-2xl p-10 shadow-lg border border-gray-200">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Edit Channel</h2>
                    <p className="mt-2 text-base text-gray-500">Update your profile information</p>
                </div>

                {/* Error/Success Messages */}
                {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-600 text-sm text-center">{error}</p></div>}
                {success && <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg"><p className="text-green-600 text-sm text-center">{success}</p></div>}

                <div className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <Input
                            placeholder="Enter your full name"
                            type="text"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 transition-colors">
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 transition-colors">
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                onChange={(e) => setCoverImage(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={updateAccount}
                        disabled={loading}
                        className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md active:scale-[0.98] mt-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EditChannel