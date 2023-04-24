import TodoList from "../model/todolist.model"

interface IObj {
  [key: string]: any
}

interface ITodo {
  _id?: string
  name: string
  price: number
  status?: string
}

interface IWhere {
  skip: number
  limit: number
  query: string
  where: IObj
}

const TodoListController = {
  gets: async (args: IWhere) => {
    return TodoList.aggregate([
      {
        $match: {
          name: new RegExp(args.query, "i"),
        },
      },
      {
        $match: {
          status: args.where?.status,
        },
      },
    ])
      .skip(args.skip)
      .limit(args.limit)
  },
  get: async (_id: string) => {
    return TodoList.findOne({ _id })
  },
  create: async (args: ITodo) => {
    const { name, price } = args
    const todo = new TodoList({ name, price })
    const result = await todo.save()
    return result
  },
  update: async (args: ITodo) => {
    const { _id, name, price, status } = args
    const todo = await TodoList.findOneAndUpdate(
      { _id },
      { $set: { name, price, status } },
      { new: true }
    )
    return todo
  },
  delete: async (_id: string) => {
    return await TodoList.findOneAndDelete({ _id })
  },
}

export default TodoListController
