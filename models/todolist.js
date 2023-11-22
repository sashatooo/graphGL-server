const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todolistSchema = new Schema({
  title: String,
  filter: String,
});

module.exports = mongoose.model("Todolist", todolistSchema);
