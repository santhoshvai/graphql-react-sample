import React from 'react'
import './BookingListItem.css'

const bookingListItem = props => {
  const { booking } = props
  return (
    <li className="booking__item">
      <div className="booking__item-data">
        {`${booking.event.title} - ${new Date(booking.createdAt).toLocaleDateString()}`}
      </div>
      <div className="booking__item-actions">
        <button className="btn" onClick={props.onCancel}>Cancel</button>
      </div>
    </li>
  )
}

export default bookingListItem