import React from 'react'
import './Spinner.css'

// Taken from https://loading.io/css
const spinner = props => (
  <div className="spinner">
    <div className="lds-dual-ring"></div>
  </div>
)

export default spinner