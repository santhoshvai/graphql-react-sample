import React, { Component } from 'react'
import './Auth.css'

class AuthPage extends Component {
  constructor(props) {
    super(props)
    this.emailEl = React.createRef()
    this.passwordEl = React.createRef()
  }

  submitHandler = (event) => {
    // the default behaviour for form submission will refresh the page,
    // we would like to prevent that
    event.preventDefault()
    const email = this.emailEl.current.value
    const password = this.passwordEl.current.value

    if (email.trim().length === 0 || password.trim().length === 0) return

    const requestBody = {
      query: `
        mutation {
          createUser(userInput: {email: "${email}", password: "${password}"}) {
            _id
            email
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
    }).then(jsonData => {
      console.log(jsonData)
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
        <form className={"auth-form"} onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor={"email"}>E-Mail</label>
            <input type={"email"} id={"email"} ref={this.emailEl} />
          </div>
          <div className="form-control">
            <label htmlFor={"password"}>Password</label>
            <input type={"password"} id={"password"} ref={this.passwordEl} />
          </div>
          <div className={"form-actions"}>
            <button type={"submit"}>Submit</button>
            <button type={"button"}>Switch to signup</button>
          </div>
        </form>
    )
  }
}

export default AuthPage