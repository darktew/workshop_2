import express from "express"
import TodoListController from "../controller/todolist.controller"
import authController from "../controller/auth.controller"

const todoListRouter = express.Router()

todoListRouter
  .get("/", async (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization || ""
      const user = await authController.verifyToken(token)
      if (!user.authorized) {
        res.status(400).json({ message: "กรุณาเข้าสู่ระบบ" })
      }
      const result = await TodoListController.gets(req.body)
      res.status(200).json({ result })
    } catch (err) {
      res.status(400).json({ message: err })
    }
  })
  .get("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization || ""
      const user = await authController.verifyToken(token)
      if (!user.authorized) {
        res.status(400).json({ message: "กรุณาเข้าสู่ระบบ" })
      }
      const result = await TodoListController.get(req.params?.id)
      res.status(200).json({ result })
    } catch (err) {
      res.status(400).json({ message: err })
    }
  })
  .post("/create", async (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization || ""
      const user = await authController.verifyToken(token)
      if (!user.authorized) {
        res.status(400).json({ message: "กรุณาเข้าสู่ระบบ" })
      }
      const result = await TodoListController.create(req.body)
      res.status(200).json({ result })
    } catch (err) {
      res.status(400).json({ message: err })
    }
  })
  .put("/update/:id", async (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization || ""
      const user = await authController.verifyToken(token)
      if (!user.authorized) {
        res.status(400).json({ message: "กรุณาเข้าสู่ระบบ" })
      }
      const result = await TodoListController.update({
        _id: req.params?.id,
        ...req.body,
      })
      res.status(200).json({ result })
    } catch (err) {
      res.status(400).json({ message: err })
    }
  })
  .delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
      const token = req.headers.authorization || ""
      const user = await authController.verifyToken(token)
      if (!user.authorized) {
        res.status(400).json({ message: "กรุณาเข้าสู่ระบบ" })
      }
      const result = await TodoListController.delete(req.params?.id)
      res.status(200).json({ result })
    } catch (err) {
      res.status(400).json({ message: err })
    }
  })

export default todoListRouter
