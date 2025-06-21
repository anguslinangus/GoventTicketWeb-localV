import React, { useEffect } from 'react'

export default function MoneyInfo({
  productData,
  discount,
  discountState,
  couponMoney,
  money,
  redeem = () => {},
}) {
  return (
    <div
      className="bg-bg-gray-secondary  rounded-4 py-3 px-4 sticky-top"
      style={{ top: '100px' }}
    >
      {productData.map((v, i) => {
        return (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center mb-1"
          >
            <div className="col text-truncate pe-2">{v.eventName}</div>
            <div className="col-auto ">
              <span className="px-1">{v.qty}</span>
              <span className="px-1">=</span> ${v.price * v.qty}
            </div>
          </div>
        )
      })}
      {discount.coupon?.value != 0 && discountState.coupon != false && (
        <>
          <div className=" d-flex justify-content-between align-items-center mb-1">
            <div>{discount.coupon?.name}</div>
            <div>
              <span className="px-1">-</span>
              {couponMoney}
            </div>
          </div>
        </>
      )}

      <div className="col-auto">
        {discount.point != 0 && discountState.point != false && (
          <>
            <div className=" d-flex justify-content-between align-items-center mb-1">
              <div className="col">點數折抵</div>
              <span className="px-1">-</span>
              {discount.point}
            </div>
          </>
        )}
      </div>
      <hr />
      <div className=" d-flex justify-content-between align-items-center fw-bold mb-1">
        合計 <span>NT${money}.00</span>
      </div>
      <div className=" d-flex justify-content-between align-items-center mb-1">
        點數回饋
        <span>
          <i className="bi bi-database"></i>
          {redeem()}
        </span>
      </div>
    </div>
  )
}
