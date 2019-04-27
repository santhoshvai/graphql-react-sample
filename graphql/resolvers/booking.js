const Event = require('../../models/event')
const Booking = require('../../models/booking')
const { transformEvent, transformBooking } = require('./utils')

module.exports = {
  bookings: async () => {
    try {
      const dbBookings = await Booking.find()
      console.log(dbBookings)
      return dbBookings.map(booking => transformBooking(booking))
    } catch(error) {
      console.log(error)
      throw error
    }
  },
  bookEvent: async args => {
    try {
      const creatorUserId = '5cb77fce4bf56a9636155922'
      const dbEvent = await Event.findOne({ _id: args.eventId })
      const booking = new Booking({
        user: creatorUserId,
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
    cancelBooking(eventId: "5cb78409c7d4e59672644537") {
      _id
      createdId
    }
  }
  */
 cancelBooking: async args => {
  try {
    // when using populate, mongoose will populate the right event reference for us
    const dbBooking = await Booking.findById(args.bookingId).populate('event')
    console.log(dbBooking)
    const event = transformEvent(dbBooking.event)
    await Booking.deleteOne({ _id: args.bookingId })
    return event
  } catch (error) {
    console.error(error)
    throw error
  }
},
}