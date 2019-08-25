import React from 'react'
import {Bar} from 'react-chartjs-2';
import './BookingChart.css'
// Bar Chart Example: https://github.com/jerairrest/react-chartjs-2/blob/master/example/src/components/bar.js

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
const CHART_COLOR = 'rgba(81,1,209,1)'
const CHART_COLOR_40 = 'rgba(81,1,209,0.4)'
const CHART_COLOR_20 = 'rgba(81,1,209,0.2)'

const bookingChart = props => {
  const labels = []
  const counts = []
  for (const bucket in BOOKING_BUCKETS) {
    const { min, max } = BOOKING_BUCKETS[bucket]
    const count = props.bookings.reduce((prev, current) => {
      if (current.event.price >= min && current.event.price < max) {
        return prev + 1
      } else {
        return prev
      }
    }, 0)
    labels.push(bucket)
    counts.push(count)
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Number of events booked",
        backgroundColor: CHART_COLOR_20,
        borderColor: CHART_COLOR,
        borderWidth: 1,
        hoverBackgroundColor: CHART_COLOR_40,
        hoverBorderColor: CHART_COLOR,
        data: counts,
      }
    ]
  }
  // if these options are not given, the y-axis seems to start from the lowest number
  const options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
  }
  return (
    <div className="chart">
      <Bar
        data={data}
        options={options}
      />
    </div>
  );
}

export default bookingChart