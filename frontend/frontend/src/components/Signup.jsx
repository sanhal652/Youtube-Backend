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

    const signup = async (data) => {
        setError(null)
        setLoading(true)
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
            navigate("/")
        } catch (error) {
            setError(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a] py-8 px-4">
            <div className="mx-auto w-full max-w-lg bg-[#1e293b] rounded-2xl p-10 shadow-2xl border border-slate-700">

                <h2 className="text-center text-3xl font-extrabold leading-tight text-white">
                    Create Account
                </h2>

                <p className="mt-2 text-center text-base text-slate-300">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-blue-400 transition-all duration-200 hover:text-blue-300 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {error && (
                    <p className="text-red-400 mt-8 text-center bg-red-900/20 py-2 rounded-lg border border-red-800/50">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(signup)} className="mt-8">
                    <div className="space-y-6">
                        <Input
                            label="fullName"
                            placeholder="Enter your full name"
                            type="text"
                            className="bg-[#0f172a] border-slate-600 text-black placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 w-full"
                            {...register("fullName", { required: true })}
                        />
                        <Input
                            label="username"
                            placeholder="Enter your username"
                            type="text"
                            className="bg-[#0f172a] border-slate-600 text-black placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 w-full"
                            {...register("username", { required: true })}
                        />
                        <Input
                            label="email"
                            placeholder="Enter your email"
                            type="email"
                            className="bg-[#0f172a] border-slate-600 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 w-full"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="password"
                            placeholder="Enter your password"
                            type="password"
                            className="bg-[#0f172a] border-slate-600 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 w-full"
                            {...register("password", { required: true })}
                        />
                        <Input
                            label="avatar"
                            type="file"
                            className="bg-[#0f172a] border-slate-600 text-black placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 w-full"
                            {...register("avatar", { required: true })}
                        />
                        <Input
                            label="coverImage"
                            type="file"
                            className="bg-[#0f172a] border-slate-600 text-black placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 w-full"
                            {...register("coverImage", { required: true })}
                        />

                        <Button
                            type="submit"
                            disabled={loading} // Disable the button while the request is in flight
                            className={`w-full py-3 bg-blue-600 hover:bg-blue-500 text-black font-bold rounded-lg transition-all duration-300 shadow-lg active:scale-[0.98] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Creating Account..." : "Get Started"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;
