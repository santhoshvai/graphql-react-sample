import React from 'react'
import './BookingTabs.css'

const bookingTabs = props => {
  return (
    <div className="booking-tabs">
      <button
        className={props.activeTab === "List" ? "active" : ""}
        onClick={() => props.onTabClick("List")}
      >
        List
      </button>
      <button
        className={props.activeTab === "Chart" ? "active" : ""}
        onClick={() => props.onTabClick("Chart")}
      >
        Chart
      </button>
    </div>
  )
}

export default bookingTabs