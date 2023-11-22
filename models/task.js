const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: String,
  isDone: Boolean,
  todolistId: String,
});

module.exports = mongoose.model("Task", taskSchema);
