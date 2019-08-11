import React from 'react'
import './EventListItem.css'

const eventListItem = props => {
  return (
    <li className="event__list__item">
      {props.title}
    </li>
  )
}

export default eventListItem
