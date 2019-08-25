import React from 'react'

const BOOKING_BUCKETS = {
  cheap: {
    min: 0,
    max: 99,
  },
  normal: {
    min: 100,
    max: 499,
  },
  expensive: {
    min: 500,
    max: Number.MAX_VALUE
  }
}

const bookingChart = props => {
  const outputCounts = {}
  for (const bucket in BOOKING_BUCKETS) {
    const { min, max } = BOOKING_BUCKETS[bucket]
    const count = props.bookings.reduce((prev, current) => {
      if (current.event.price >= min && current.event.price < max) {
        return prev + 1
      } else {
        return prev
      }
    }, 0)
    outputCounts[bucket] = count
  }
  console.log(outputCounts)
  return <p>{JSON.stringify(outputCounts)}</p>
}

export default bookingChart