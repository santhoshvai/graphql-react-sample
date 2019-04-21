const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

const getEventsByIds = async eventIds => {
  try {
    const dbEvents = await Event.find({
      _id: {$in: eventIds}
    })
    return dbEvents.map(event => ({
      ...event._doc,
      _id: event.id,
      creator: getUserById.bind(this, event._doc.creator)
    }))
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getUserById = async userId => {
  try {
    const user = await User.findById(userId)
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: getEventsByIds.bind(this, user._doc.createdEvents)
    }
  } catch(error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  /*
  query {
    events {
      title
      _id
    }
  }
  */
  events: () => {
    return Event.find().then(events => {
      console.log(events)
      // ._doc leaves out all meta data
      return events.map(event => ({
        ...event._doc,
        _id: event.id,
        // bind creates a new function from another function
        // Santhosh: LAZY evaluated function basically, only done when creator is asked for
        // Graphql will see if a property is a function and will execute it and return its value
        creator: getUserById.bind(this, event._doc.creator)
      }))
    }).catch(err => {
      console.log(err)
      throw err
    })
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
      return {
        ...savedEvent._doc,
        _id: savedEvent.id,
        creator: getUserById.bind(this, savedEvent._doc.creator)
      }
    } catch(error) {
      console.log(error)
      throw error
    }
  },
  /*
    mutation {
      createUser(userInput: {email: "karthick@kk.com", password: "testing" }) {
        _id
        email
        password
      }
    }
  */
  createUser: async args => {
    const previousUser = await User.findOne({ email: args.userInput.email })
    if (previousUser) {
      // dont allow users with same user id
      throw new Error('User Exists Alredy')
    } else {
      try {
        // 12 is a safe salt value
        const hash = await bcrypt.hash(args.userInput.password, 12)
        const user = new User({
          email: args.userInput.email,
          // always store only the hash of the password not the plain text of the password
          // in this way even if db is ahcked one cant get the password of the user
          password: hash
        })
        const savedUser = await user.save()
        return ({ ...savedUser._doc, password: null, _id: savedUser.id })
      } catch (error) {
        console.error(error)
      }
    }
  }
}