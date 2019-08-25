const DataLoader = require('dataloader')
const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const guaranteeIdOrder = (dbFetchedData, givenIds) => {
  // Mongodb doesnt guarantee that the ordering of given data is equivalent to the ordering of ids asked.
  // example say if we send ids [a,b,c] it can send events with ids of [b,a,c]
  // to mitigate that sort the result based on the ordering we need
  dbFetchedData.sort((a, b) => {
    givenIds.indexOf(a._id.toString()) - givenIds.indexOf(b._id.toString())
  })
}
const eventLoader = new DataLoader(eventIds => getEventsByIds(eventIds));
const userLoader = new DataLoader(async (userIds) => {
    const dbData = await User.find( {_id: {$in: userIds}})
    guaranteeIdOrder(dbData, userIds)
    return dbData
  }
);

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
    guaranteeIdOrder(dbEvents, eventIds)
    return dbEvents.map(event => transformEvent(event))
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getEventById = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString())
    return event
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getUserById = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
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