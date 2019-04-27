const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const transformEvent = dbEvent => ({
  ...dbEvent._doc,
  _id: dbEvent.id,
  date: dateToString(dbEvent._doc.date),
  // bind creates a new function from another function
  // Santhosh: LAZY evaluated function basically, only done when creator is asked for
  // Graphql will see if a property is a function and will execute it and return its value
  creator: getUserById.bind(this, dbEvent._doc.creator)
})

const transformBooking = dbBooking => ({
  ...dbBooking._doc,
  _id: dbBooking.id,
  user: getUserById.bind(this, dbBooking._doc.user),
  event: getEventById.bind(this, dbBooking._doc.event),
  createdAt: dateToString(dbBooking._doc.createdAt),
  updatedAt: dateToString(dbBooking._doc.updatedAt),
})

const transformUser = dbUser => ({
  ...dbUser._doc,
  password: null,
  _id: dbUser.id
})

const getEventsByIds = async eventIds => {
  try {
    const dbEvents = await Event.find({
      _id: {$in: eventIds}
    })
    return dbEvents.map(event => transformEvent(event))
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getEventById = async eventId => {
  try {
    const dbEvent = await Event.findById(eventId)
    return transformEvent(dbEvent)
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

exports.getEventById = getEventById
exports.getUserById = getUserById
exports.getEventById = getEventById
exports.transformEvent = transformEvent
exports.transformBooking = transformBooking
exports.transformUser = transformUser