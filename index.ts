import express, { Application } from "express"
import session from "express-session"
import passport from "passport"
import http from "http"
import next from "next"
import { v4 } from "uuid"
import authRouter from "./server/route/auth.route"
import "./lib/db"
import todoListRouter from "./server/route/todolist.route"

// const app: Application = express()
const dev = process.env.NODE_ENV !== "production"
const port: number = 3000
const app = next({ dev })

const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server
    .use(
      session({
        genid: (req: express.Request) => v4(),
        secret: "workshopsecret",
        resave: false,
        saveUninitialized: false,
      })
    )
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(passport.initialize())
    .use(passport.session())

  server.use("/api/auth", authRouter)
  server.use("/api/todolist", todoListRouter)
  
  server.all("*", (req, res) => {
    return handle(req, res)
  })
  server.listen(port, (err?: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

// const startServer = async () => {
// app.use(express.json({ limit: "100mb" }))
// app
//   .use(
//     express.urlencoded({
//       limit: "100mb",
//       extended: true,
//       parameterLimit: 50000,
//     })
//   )
//   .use(passport.initialize())
//   .use(passport.session())

// const httpServer = http.createServer(app)

// httpServer.listen(port, () => {
//   console.log("Server Running in port :", port)
// })
// }

// startServer()
