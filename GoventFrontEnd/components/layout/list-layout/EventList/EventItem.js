import React from 'react'

function EventItem(props) {
  const { id, event_name, image, price, category_name} = props.event
  return (
    <>
      <tr>
        <td className="number text-center">{id}</td>
        <td className="image">
          <img src={image} alt="" />
        </td>
        <td className="event">
          <strong>{event_name}</strong>
        </td>
        <td className="rate text-right">{category_name}</td>
        <td className="price text-right">${price}</td>
      </tr>
    </>
  )
}

export default EventItem
