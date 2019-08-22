import React, { Component } from 'react'
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/BookingList/BookingList'

class BookingsPage extends Component {
  static contextType = AuthContext;

  state = {
    isLoading: false,
    bookings: [],
  }

  isActive = true

  componentDidMount() {
    this.fetchBookings()
  }

  componentWillUnmount() {
    this.isActive = false
  }

  handleOnCancel = (booking) => {
    this.setState({ isLoading: true })
    const token = this.context.token
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${booking._id}") {
            _id
            title
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
      if (!this.isActive) return
      this.setState(prevState => {
        // delete the booking from the state
        const bookings = prevState.bookings.filter(prevBooking => prevBooking._id !== booking._id)
        return { bookings, isLoading: false }
      })
    }).catch(err => {
      console.log(err)
    })
  }

  fetchBookings() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            event {
              _id
              title
              date
            }
            createdAt
          }
        }
      `
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.context.token}`
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed')
      }
      return res.json()
    }).then(resData => {
      if (!this.isActive) return
      const bookings = resData.data.bookings
      this.setState({ bookings, isLoading: false })
    }).catch(err => {
      console.log(err)
      this.setState({ isLoading: false })
    })
  }

  render() {
    return this.state.isLoading ? <Spinner /> : <BookingList bookings={this.state.bookings} onCancel={this.handleOnCancel} />
  }
}

export default BookingsPage