import axios from "axios"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { ToastContainer, toast } from "react-toastify"

interface IFormSignup {
  email: string
  name: string
  password: string
  confirmpassword: string
}

const SignupPage: NextPage = () => {
  const router = useRouter()

  const [form, setForm] = useState<IFormSignup>({
    email: "",
    name: "",
    password: "",
    confirmpassword: "",
  })

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const { password, confirmpassword, email, name } = form
      if (password !== confirmpassword) {
        setForm({ email: "", name: "", password: "", confirmpassword: "" })
        return toast.warning("รหัสผ่านไม่ตรงกันกรุณาลองใหม่อีกครั้ง")
      }
      await axios.post(`/api/auth/signup`, {
        name,
        email,
        password,
      })
      toast.success("คุณทำการสมัครสมาชิกสำเร็จ")
      return router.replace("/login")
    } catch (err: any) {
      return toast.error(err?.response?.data?.error?.message)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <section className="flex w-[30rem] flex-col space-y-10">
        <div className="text-center text-4xl font-medium">SIGN UP</div>
        <form
          className="flex w-[30rem] flex-col space-y-10"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            onSubmit(event)
          }
        >
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="text"
              placeholder="Name"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="text"
              placeholder="Email or Username"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
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
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
          </div>
          <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({
                  ...prev,
                  confirmpassword: event.target.value,
                }))
              }
              required
            />
          </div>

          <button
            type="submit"
            className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
          >
            SIGN UP
          </button>

          <button
            className="transform rounded-sm bg-black py-2 font-bold duration-300 hover:bg-indigo-400"
            onClick={() => router.back()}
          >
            BACK
          </button>
        </form>
      </section>
    </main>
  )
}

export default SignupPage
