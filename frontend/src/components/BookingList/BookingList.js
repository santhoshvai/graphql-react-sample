import React from 'react'
import BookingListItem from './BookingListItem/BookingListItem'
import './BookingList.css'

const bookingList = props => {
  const bookingListUi = props.bookings.map(booking => {
    return <BookingListItem key={booking._id} booking={booking} onCancel={() => props.onCancel(booking)} />
  })
  return <ul className="booking__list">{bookingListUi}</ul>
}

export default bookingList