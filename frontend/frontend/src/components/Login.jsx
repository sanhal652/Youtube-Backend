import React from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"
import { userLogin } from '../axiosFiles/userApi'
import { login } from "../store/authSlice"
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Login() {

    const dispatch = useDispatch()
    const navigate=useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const userLoginHandler = async (data) => {
        setError(null)
        setLoading(true)
        try {
            const response= await userLogin({
                username:data.username,
                email:data.email,
                password:data.password
            })
            dispatch(login(response.data.user))
            navigate("/")
        } catch (error) {
            setError(error.response?.data?.message)
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
                    Login into your account
                </h2>
                <p className="mt-2 text-base text-gray-500">
                    Don't have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-semibold text-red-600 hover:text-red-500 hover:underline transition-all duration-200"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(userLoginHandler)}>
                <div className="space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <Input
                            placeholder="Enter your username"
                            type="text"
                            className="w-full border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            {...register("username")}
                        />
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
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Enter a valid email address"
                                }
                            })}
                        />
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


                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md active:scale-[0.98] mt-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Logging in..." : "Log in →"}
                    </Button>

                </div>
            </form>
        </div>
    </div>
)
}

export default Login