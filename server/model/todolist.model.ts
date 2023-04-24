import mongoose, { Schema } from "mongoose"

export interface ITodoList extends Document {
  name: string
  price: number
  status: string
  createdDate: Date
  updatedDate: Date
}

const TodoListSchema = new Schema<ITodoList>({
  name: {
    type: String,
    unique: true,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["active","inactive"],
    default: "active",
  },
  createdDate: {
    type: Date,
  },
  updatedDate: {
    type: Date,
  },
})

TodoListSchema.path("name").validate(function (this: any, value: string): boolean {
  return this.constructor
    .findOne({ name: value })
    .exec()
    .then((todo: ITodoList) => {
      if(todo) {
        if(this.name === todo.name) {
          return true
        }
        return false
      }
      return true
    })
    .catch(function (err: any) {
      throw err
    })
}, "ชื่อสินค้านี้มีอยู่ในระบบอยู่แล้วกรุณาลองใหม่อีกครั้ง")

TodoListSchema.pre("save", function (this: any, next: any): any {
  const now = new Date()

  if (!this.createdDate) {
    this.createdDate = now
  } else {
    this.updatedDate = now
  }
})

const TodoList = mongoose.model("todolist", TodoListSchema)

export default TodoList

