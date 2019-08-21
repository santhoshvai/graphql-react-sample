import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'
import AuthContext from '../context/auth-context';
import EventList from '../components/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'

class EventsPage extends Component {
  state = {
    creating: false,
    detailVisiting: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
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
    this.setState({ creating: false, detailVisiting: false })
  }

  handleOnBook = () => {
    const token = this.context.token
    if (!token) {
      // this was an "OK button click", so just close the modal
      this.setState({ selectedEvent: null, detailVisiting: false })
      return
    }
    const { selectedEvent } = this.state
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `
    }

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
      console.log(resData.data.bookEvent)
      // close the modal
      this.setState({ selectedEvent: null, detailVisiting: false })
    }).catch(err => {
      console.log(err)
    })
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
      this.setState(prevState => {
        const { _id, title, description, price, date } = resData.data.createEvent
        const event = {
          _id,
          title,
          description,
          price,
          date,
          creator: {
            _id: this.context.userId
          }
        }
        const events = [...prevState.events, event]
        return { events }
      })
    }).catch(err => {
      console.log(err)
    })
  }

  handleOnDetailPress = event => {
    this.setState({ detailVisiting: true, selectedEvent: event })
  }

  fetchEvents() {
    this.setState({ isLoading: true })
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
      this.setState({ events, isLoading: false })
    }).catch(err => {
      console.log(err)
      this.setState({ isLoading: false })
    })
  }

  render() {
    const token = this.context.token
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal title="Add Event" canCancel canConfirm onCancel={this.handleOnCancel} onConfirm={this.handleOnConfirm} confirmText="Cancel">
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
        {this.state.detailVisiting && (
          <React.Fragment>
            <Backdrop />
            <Modal title={this.state.selectedEvent.title} canCancel={!!token} canConfirm onCancel={this.handleOnCancel} onConfirm={this.handleOnBook} confirmText={token ? "Book Event" : "Ok"}>
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>{`$${this.state.selectedEvent.price} - ${(new Date(this.state.selectedEvent.date)).toLocaleDateString()}`}</h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}
        {this.context.token && <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.createEventHandler}>Create Event</button>
        </div>}
        {this.state.isLoading ? <Spinner /> : <EventList events={this.state.events} onDetailPress={this.handleOnDetailPress} />}
      </React.Fragment>
    )
  }
}

export default EventsPage