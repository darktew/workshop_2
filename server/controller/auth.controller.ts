import passport from "passport"
import { setupLc } from "../passport/index"
import { IncomingHttpHeaders } from "http"
import User, { IUser } from "../model/user.model"
import { refreshToken, signToken, verifyJWT } from "../../lib/common"

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

passport.serializeUser((user: any, done: any): void => {
  done(null, user)
})

passport.deserializeUser((user: any, done: any): void => {
  done(null, user)
})

// passport local
setupLc(User)

const authController = {
  signin: (data: ISignin) => {
    return new Promise((resolve, reject): void => {
      passport.authenticate("local", (err: any, user: any, info: any) => {
        const error = err || info
        if (error) {
          return reject(`${error.message}`)
        }
        if (!user) {
          return reject("Email or Password invalid, Please try again.")
        }
        resolve({
          ...user.profile,
          token: signToken(user.signtoken, false),
          rtoken: refreshToken(user),
        })
      })({ body: data })
    })
  },
  signup: async (data: ISignup): Promise<IUser> => {
    // Create user
    const { email, password, name } = data
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      name,
    })
    const user: IUser = await newUser.save()
    const update: IUser = await user.save()
    return update.profile
  },
  signout: async (args: IId): Promise<IUser | null> => {
    return User.findOneAndUpdate(
      { _id: args._id },
      { rtoken: "" },
      { new: true }
    )
  },

  verifyToken: async (token: string): Promise<any | null> => {
    if (!token) {
      return { authorized: false }
    }

    try {
      const result: any = verifyJWT(token)
      const user: IUser | null = await User.findById(result._id)
      if (result) return { authorized: true, data: user }
      return { authorized: false }
    } catch (err) {
      return { authorized: false, error: err }
    }
  },
}

export default authController
