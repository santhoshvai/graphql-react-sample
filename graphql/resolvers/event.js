const Event = require('../../models/event')
const User = require('../../models/user')
const { transformEvent } = require('./utils')

module.exports = {
  /*
  query {
    events {
      title
      _id
    }
  }
  */
  events: async () => {
    try {
      const dbEvents = await Event.find()
      console.log(dbEvents)
      return dbEvents.map(event => transformEvent(event))
    } catch(err) {
      console.log(err)
      throw err
    }
  },
  /*
  mutation {
    createEvent(eventInput: {title: "karthick", description: "THE BEST", price: 1000.0, date: "2019-04-16T18:39:03.101Z" }) {
      _id
      title
      date
    }
  }
  {
	"query": "mutation { createEvent(eventInput: {title: \"should work\", description: \"This works?\", price: 39.99, date: \"2019-04-27T18:39:03.101Z\"} ) { _id title } }"
  }
  */
 createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    const event = new Event({
      ...args.eventInput,
      // parse from string to JS Date
      date: new Date(args.eventInput.date),
      creator: req.userId // mongoose will convert string to objectId
    })
    // hit DB and save it
    try {
      const savedEvent = await event.save()
      // push the event to the user database (not the id)
      const user = await User.findById(req.userId)
      if (!user) {
        throw new Error('User Doesnt exist')
      }
      user.createdEvents.push(savedEvent._id)
      user.save()
      // return the event
      return transformEvent(savedEvent)
    } catch(error) {
      console.log(error)
      throw error
    }
  },
}