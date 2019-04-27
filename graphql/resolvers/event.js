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
  */
  createEvent: async (args) => {
    const creatorUserId = '5cb77fce4bf56a9636155922'
    const event = new Event({
      ...args.eventInput,
      // parse from string to JS Date
      date: new Date(args.eventInput.date),
      creator: creatorUserId // mongoose will convert string to objectId
    })
    // hit DB and save it
    try {
      const savedEvent = await event.save()
      // push the event to the user database (not the id)
      const user = await User.findById(creatorUserId)
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