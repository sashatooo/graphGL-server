const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require("mongoose");

const cors = require('cors')

const app = express();
const PORT = 3055;

mongoose.connect('mongodb://localhost:27017/todos'); 
app.use(cors())
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);




const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log(`Connection to DB`));

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log("Server started!");
});
