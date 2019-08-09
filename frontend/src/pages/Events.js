import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'

class EventsPage extends Component {
  state = {
    creating: false
  }

  createEventHandler = () => {
    this.setState({ creating: true })
  }

  handleOnCancel = () => {
    this.setState({ creating: false })
  }

  handleOnConfirm = () => {
    this.setState({ creating: false })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal title="Add Event" canCancel canConfirm onCancel={this.handleOnCancel} onConfirm={this.handleOnConfirm}><p>Modal Content</p></Modal>
          </React.Fragment>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.createEventHandler}>Create Event</button>
        </div>
      </React.Fragment>
    )
  }
}

export default EventsPage