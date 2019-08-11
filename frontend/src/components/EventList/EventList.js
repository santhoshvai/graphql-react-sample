import React from 'react'
import EventListItem from './EventListItem/EventListItem'
import './EventList.css'

const eventList = props => {
  const eventListUi = props.events.map(event => {
    return <EventListItem key={event._id} eventId={event._id} title={event.title} />
  })
  return <ul className="event__list">{eventListUi}</ul>
}

export default eventList