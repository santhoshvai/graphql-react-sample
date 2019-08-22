const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { transformEvent, transformBooking } = require('./utils')

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      // fetch only the bookings done by the authenticated user
      const dbBookings = await Booking.find({ user: req.userId })
      return dbBookings.map(booking => transformBooking(booking))
    } catch(error) {
      console.log(error)
      throw error
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const dbEvent = await Event.findOne({ _id: args.eventId })
      const booking = new Booking({
        user: req.userId,
        event: dbEvent,
      })
      const result = await booking.save()
      return transformBooking(result)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  /*
  mutation {
    cancelBooking(bookingId: "5cb78409c7d4e59672644537") {
      _id
      title
    }
  }
  */
 cancelBooking: async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated')
  }
  try {
    // when using populate, mongoose will populate the right event reference for us
    const dbBooking = await Booking.findById(args.bookingId).populate('event')
    const event = transformEvent(dbBooking.event)
    await Booking.deleteOne({ _id: args.bookingId })
    return event
  } catch (error) {
    console.error(error)
    throw error
  }
},
}