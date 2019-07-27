
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

// connect to mongodb cluster
const { MONGO_USER, MANGO_PASSWORD, MONGO_DB } = process.env
mongoose.connect(`mongodb+srv://${MONGO_USER}:${MANGO_PASSWORD}@cluster0-abeh6.mongodb.net/${MONGO_DB}?retryWrites=true`, { useNewUrlParser: true }).then(() => {
  // app can listen from port 8000, 3000 is used by front end
  app.listen(8000)
}).catch(err => {
  console.log(err)
})

// parse incoming json bodies
app.use(bodyParser.json())

// express will run isAuth on every incoming request
app.use(isAuth)

app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  // has all resolver functions for that schema
  rootValue: graphqlResolvers,
  graphiql: true
}))
