import React from 'react'

function PriceRangeRadio(props) {
  const { priceRange, setPriceRange, value } = props

  return (
    <>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          value={value}
          checked={priceRange === value}
          onChange={(e) => {
            setPriceRange(e.target.value)
          }}
        />
        <label className="form-check-label">{value}</label>
      </div>
    </>
  )
}

export default PriceRangeRadio