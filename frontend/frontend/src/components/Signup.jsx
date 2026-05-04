import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from 'react-redux'
import { login } from "../store/authSlice"
import { userSignup } from '../axiosFiles/userApi'

function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const[success,setSuccess]=useState(null)
    const signup = async (data) => {
        setError(null)
        setLoading(true)
        setSuccess(null)
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName)
            formData.append("username", data.username)
            formData.append("email", data.email)
            formData.append("password", data.password)
            formData.append("avatar", data.avatar[0])
            formData.append("coverImage", data.coverImage[0])

            const response = await userSignup(formData)
            dispatch(login(response.data))
            setSuccess("Account created successfully!")
            setTimeout(() => {
            navigate("/")
        },1000)
           
        } catch (error) {
            setError("User already exists with the provided email or username. Please try again with different credentials.")
        } finally {
            setLoading(false)
        }
    }
   return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8 px-4">
        <div className="mx-auto w-full max-w-lg bg-white rounded-2xl p-10 shadow-lg border border-gray-200">

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-block bg-red-600 text-white font-bold text-lg px-3 py-1 rounded mb-4">
                    VT
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Create Account
                </h2>
                <p className="mt-2 text-base text-gray-500">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-red-600 hover:text-red-500 hover:underline transition-all duration-200"
                    >
                        Sign In
                    </Link>
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm text-center">{success}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(signup)}>
                <div className="space-y-5">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <Input
                            placeholder="Enter your full name"
                            type="text"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            {...register("fullName", { required: true })}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">Full name is required</p>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <Input
                            placeholder="Enter your username"
                            type="text"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            {...register("username", { required: true })}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">Username is required</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Enter a valid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message || "Email is required"}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <Input
                            placeholder="Enter your password"
                            type="password"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            {...register("password", { required: true })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">Password is required</p>
                        )}
                    </div>

                    {/* Avatar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Avatar <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 transition-colors">
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                {...register("avatar", { required: true })}
                            />
                        </div>
                        {errors.avatar && (
                            <p className="text-red-500 text-xs mt-1">Avatar is required</p>
                        )}
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cover Image <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-400 transition-colors">
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                                {...register("coverImage")}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md active:scale-[0.98] mt-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Creating Account..." : "Get Started →"}
                    </Button>

                </div>
            </form>
        </div>
    </div>
)
}

export default SignUp;
