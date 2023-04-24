import express from "express"
import authController from "../controller/auth.controller"

interface ISignin {
  email: string
  password: string
  remember?: boolean
}

interface ISignup {
  email: string
  name: string
  password: string
}

interface IId {
  _id: string
}

const authRouter = express.Router()

authRouter
  .post("/login", async (req: express.Request, res: express.Response) => {
    try {
      const result = await authController.signin(req.body as ISignin)
      res.status(200).json({ message: "Login Success!", result })
    } catch (err) {
      res.status(400).json({ message: "Login Failed!", error: err })
    }
  })
  .post("/signup", async (req: express.Request, res: express.Response) => {
    try {
      const result = await authController.signup(req.body as ISignup)
      res.status(200).json({ message: "Signup Success!", result })
    } catch (err) {
      res.status(400).json({ message: "Signup Failed!", error: err })
    }
  })
  .post("/logout", async (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization || ""
      const user = await authController.verifyToken(token)
      if (!user.authorized) {
        res.status(400).json({ message: "กรุณาเข้าสู่ระบบ" })
      }
      const result = await authController.signout({ _id: user.data._id })
      res.status(200).json({ message: "Logout Success!", result })
    } catch (err) {
      res.status(400).json({ message: "Login Failed!", error: err })
    }
  })

export default authRouter
