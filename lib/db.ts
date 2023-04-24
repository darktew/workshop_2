import mongoose from "mongoose"
import dotenv from "dotenv"
import fs from "fs"
const envFile: string = `.env`

if (fs.existsSync(envFile)) {
  console.log(`Using ${envFile} file to supply config environment variables`)

  dotenv.config({ path: envFile })
}

const MONGO_URL: string = process.env.MONGO_URL || ""
const MONGO_USER: string = process.env.MONGO_USER || ""
const MONGO_PASS: string = process.env.MONGO_PASS || ""

// help to debug mongoose
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true)
}

// mongoose.set("debug", true)

let config: any = {
  // user: MONGO_USER,
  // pass: MONGO_PASS,
  // auth: {
  //   user: MONGO_USER,
  //   pass: MONGO_PASS,
  // },
  // authSource: "admin",
}

if (MONGO_USER && MONGO_PASS && process.env.NODE_ENV === "production") {
  config = {
    user: MONGO_USER,
    pass: MONGO_PASS,
    auth: {
      user: MONGO_USER,
      pass: MONGO_PASS,
    },
    authSource: "admin",
  }
}

mongoose.connect(MONGO_URL, config)

export default mongoose
