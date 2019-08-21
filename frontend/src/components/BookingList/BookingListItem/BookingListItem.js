import React from 'react'
import './BookingListItem.css'

const bookingListItem = props => {
  const { booking } = props
  return <li>{booking.createdAt}</li>
}

export default bookingListItem