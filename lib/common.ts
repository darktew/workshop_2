import { IUser } from "@/server/model/user.model"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import moment from "moment"

const TOKEN_EXPIRE: number = 12 * 60 * 60
const RTOKEN_EXPIRE = TOKEN_EXPIRE
const JWT_SECRET: string = "workshopsecret"

export const signToken = (data: IUser, remember?: boolean): string => {
  let expire = TOKEN_EXPIRE
  if (remember) {
    expire = expire * 2
  }

  return jwt.sign(data, JWT_SECRET, {
    expiresIn: expire,
  })
}

export const refreshToken = (data: IUser): string => {
  const end = moment(data.updatedAt || data.createdAt)
  const now = moment()
  let time = end

  if (end) {
    const duration = moment.duration(now.diff(end))
    const days = duration.asDays()
    if (days > RTOKEN_EXPIRE) {
      time = now
    }
  }

  const rtoken: string = crypto
    .pbkdf2Sync(
      `${data._id} ${data.password} ${time.format("YYYY-MM-DD HH:mm:ss")}`,
      JWT_SECRET,
      10000,
      100,
      "sha1"
    )
    .toString("base64")

  if (data.rtoken !== rtoken) {
    data.rtoken = rtoken
    data.save()
  }
  return rtoken
}

export const verifyJWT = (token: string): object | string => {
  return jwt.verify(String(token).replace("Bearer ", ""), JWT_SECRET)
}
