import React from 'react'
import './EventListItem.css'
import AuthContext from '../../../context/auth-context'

class EventListItem extends React.Component {
  static contextType = AuthContext
  render() {
    const { title, price, creator } = this.props.event
    const authUserId = this.context.userId
    const isOwner = creator._id === authUserId

    return (
      <li className="event__list__item">
        <div>
          <h1>{title}</h1>
          <h2>{`$${price}`}</h2>
        </div>
        <div>
          {!isOwner && <button className={"btn"}>View Details</button>}
          {isOwner && <p>You are the owner of this event</p>}
        </div>
      </li>
    )
  }
}

export default EventListItem
