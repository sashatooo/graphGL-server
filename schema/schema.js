const graphql = require("graphql");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const Todolist = require("../models/todolist");
const Task = require("../models/task");

// const todolists = [
//   { id: "1", title: "What to learn", filter: "all" },
//   { id: "2", title: "What to buy", filter: "complited" },
// ];

// const tasks = [
//   { id: "1", title: "HTML&CSS", isDone: true, todolistId: "1" },
//   { id: "2", title: "JS", isDone: true, todolistId: "1" },
//   { id: "3", title: "REACT", isDone: false, todolistId: "1" },
//   { id: "4", title: "Milk", isDone: true, todolistId: "2" },
//   { id: "5", title: "Tomato", isDone: false, todolistId: "2" },
//   { id: "6", title: "Kivi", isDone: true, todolistId: "2" },
// ];

// const todolists = [
//   { title: "What to learn", filter: "all" }, // 655c69799d912d43ee19279d
//   { title: "What to buy", filter: "complited" }, // 655c69a49d912d43ee19279e
// ];

// const tasks = [
//   { title: "HTML&CSS", isDone: true, todolistId: },
//   { title: "JS", isDone: true, todolistId: },
//   { title: "REACT", isDone: false, todolistId: },
//   { title: "Milk", isDone: true, todolistId: },
//   { title: "Tomato", isDone: false, todolistId: },
//   { title: "Kivi", isDone: true, todolistId: },
// ];

const TodolistType = new GraphQLObjectType({
  name: "Todolist",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    filter: { type: new GraphQLNonNull(GraphQLString) },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        // return tasks.filter((t) => t.todolistId === parent.id);
        return Task.find({ todolistId: parent.id });
      },
    },
  }),
});

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    isDone: { type: new GraphQLNonNull(GraphQLBoolean) },
    todolist: {
      type: TodolistType,
      resolve(parent, args) {
        // return todolists.find((tl) => tl.id === parent.todolistId);
        return Todolist.findById(parent.todolistId);
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTodolist: {
      type: TodolistType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const todolist = new Todolist({
          title: args.title,
          filter: "all",
        });
        return todolist.save();
      },
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        isDone: { type: new GraphQLNonNull(GraphQLBoolean) },
        todolistId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const task = new Task({
          title: args.title,
          isDone: args.isDone,
          todolistId: args.todolistId,
        });
        return task.save();
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findByIdAndDelete(args.id);
      },
    },
    deleteTodolist: {
      type: TodolistType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Todolist.findByIdAndDelete(args.id);
      },
    },
    updateTodolist: {
      type: TodolistType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        filter: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Todolist.findByIdAndUpdate(
          args.id,
          { $set: { title: args.title, filter: args.filter } },
          { new: true }
        );
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        isDone: { type: new GraphQLNonNull(GraphQLBoolean) },
        todolistId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Task.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              isDone: args.isDone,
              todolistId: args.todolistId,
            },
          },
          { new: true }
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    todolist: {
      type: TodolistType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return todolists.find((tl) => tl.id == args.id);
        return Todolist.findById(args.id);
      },
    },
    task: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return tasks.find((t) => t.id == args.id);
        return Task.findById(args.id);
      },
    },
    todolists: {
      type: new GraphQLList(TodolistType),
      resolve(parent, args) {
        // return todolists;
        return Todolist.find({});
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        // return tasks;
        return Task.find({});
      },
    },
    tasksByTodolistId: {
      type: new GraphQLList(TaskType),
      args: {
        id: {type: GraphQLID},
        filter: {type: GraphQLString }
      },
      resolve(parent, args) {
        let taskForTodoList = Task.find({todolistId: args.id}) 
        if(args.filter === "complited") {
          taskForTodoList.find({isDone: false})
        }
        if(args.filter === "active") {
          taskForTodoList.find({isDone: true})
        }
        return taskForTodoList
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
