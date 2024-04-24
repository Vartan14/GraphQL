const express = require("express")
const {graphqlHTTP} = require("express-graphql")
const schema = require("../schema/schema")
const connectDB = require("../config/db");
const mongoose = require("mongoose");

const app = express()
const PORT = 3001

connectDB();


app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true,
}))


app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server started on ${PORT} port.`)
})
