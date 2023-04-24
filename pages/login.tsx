import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import Cookies from "js-cookie"
import { NextPage } from "next"

const LoginPage: NextPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const result = await axios.post(`/api/auth/login`, { email, password })
      Cookies.set("usertodo", JSON.stringify(result.data?.result))
      toast.success("Login Success")
      return router.replace("/")
    } catch (err: any) {
      toast.error(err.response?.data?.error)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <section className="flex w-[30rem] flex-col space-y-10">
        <div className="text-center text-4xl font-medium">Log In</div>
        <form
          className="flex w-[30rem] flex-col space-y-10"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            onSubmit(event)
          }
        >
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="text"
              placeholder="Email or Username"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="password"
              placeholder="Password"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
          >
            LOG IN
          </button>
        </form>
        <p className="text-center text-lg">
          No account?
          <Link
            href="/signup"
            className="font-medium text-indigo-500 underline-offset-4 hover:underline ml-2"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
