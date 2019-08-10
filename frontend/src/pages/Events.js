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

  // input EventInput {
  //   title: String!
  //   description: String!
  //   price: Float!
  //   date: String!
  // }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal title="Add Event" canCancel canConfirm onCancel={this.handleOnCancel} onConfirm={this.handleOnConfirm}>
              <form onSubmit={this.submitHandler}>
                <div className="form-control">
                  <label htmlFor={"title"}>Title</label>
                  <input type={"text"} id={"title"} ref={this.titleEl} />
                </div>
                <div className="form-control">
                  <label htmlFor={"price"}>Price</label>
                  <input type={"number"} id={"price"} ref={this.priceEl} />
                </div>
                <div className="form-control">
                  <label htmlFor={"date"}>Date</label>
                  <input type={"date"} id={"date"} ref={this.dateEl} />
                </div>
                <div className="form-control">
                  <label htmlFor={"description"}>Description</label>
                  <textarea id="description" rows="4" />
                </div>
              </form>
            </Modal>
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