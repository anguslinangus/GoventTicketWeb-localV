import React from 'react'
import EventItem from './EventItem'

// 引入活動資料
import useEvents from '@/hooks/use-event'

function EventList(props) {
  const { events } = props
// console.log(events);
const { data } = useEvents()

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover">
          <tbody>
            {data?.map((event, i) => {
              return <EventItem key={i} event={event} />
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EventList
