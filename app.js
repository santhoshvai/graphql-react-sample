
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

const app = express()

// connect to mongodb cluster
const { MONGO_USER, MANGO_PASSWORD, MONGO_DB } = process.env
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MANGO_PASSWORD}@cluster0-abeh6.mongodb.net/${MONGO_DB}?retryWrites=true`, { useNewUrlParser: true }).then(() => {
  // app can listen from port 3000
  app.listen(3000)
}).catch(err => {
  console.log(err)
})

// parse incoming json bodies
app.use(bodyParser.json())

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  // has all resolver functions for that schema
  rootValue: graphqlResolvers,
  graphiql: true
}))
