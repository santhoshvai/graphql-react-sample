import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'
import AuthContext from '../context/auth-context';

class EventsPage extends Component {
  state = {
    creating: false,
    events: []
  }

  // react will automatically populate this.context now
  static contextType = AuthContext;

  constructor(props) {
    super(props)
    this.titleEl = React.createRef()
    this.priceEl = React.createRef()
    this.dateEl = React.createRef()
    this.descriptionEl = React.createRef()
  }

  componentDidMount() {
    this.fetchEvents()
  }

  createEventHandler = () => {
    this.setState({ creating: true })
  }

  handleOnCancel = () => {
    this.setState({ creating: false })
  }

  handleOnConfirm = () => {
    this.setState({ creating: false })
    const title = this.titleEl.current.value
    const price = this.priceEl.current.value
    const date = this.dateEl.current.value
    const description = this.descriptionEl.current.value

    if (title.trim().length === 0 || price.trim().length === 0
    || date.trim().length === 0 || description.trim().length === 0) return

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    }

    const token = this.context.token

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed')
      }
      return res.json()
    }).then(resData => {
      this.fetchEvents()
    }).catch(err => {
      console.log(err)
    })
  }

  fetchEvents() {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed')
      }
      return res.json()
    }).then(resData => {
      const events = resData.data.events
      this.setState({ events })
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const eventList = this.state.events.map(event => {
      return <li className="events__list__item" key={event._id}>{event.title}</li>
    })
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
                  <input type={"datetime-local"} id={"date"} ref={this.dateEl} />
                </div>
                <div className="form-control">
                  <label htmlFor={"description"}>Description</label>
                  <textarea id="description" rows="4" ref={this.descriptionEl} />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}
        {this.context.token && <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.createEventHandler}>Create Event</button>
        </div>}
        <ul className="events__list">{eventList}</ul>
      </React.Fragment>
    )
  }
}

export default EventsPage