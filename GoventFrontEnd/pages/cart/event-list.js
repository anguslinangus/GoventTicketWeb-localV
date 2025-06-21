import React from 'react'
import events from '@/data/cart/events.json'
import Link from 'next/link'
//勾子
import { useCart } from '@/hooks/use-cart'
import { add } from 'lodash'

export default function EventList() {
  const { addItem } = useCart()
  //   console.log(addItem)
  // console.log(items)

  return (
    <>
      <ul className="text-white">
        {events.map((v, i) => {
          return (
            <li className="" key={v.id}>
              <div className="">活動名稱 : {v.eventName}</div>
              <div>商家ID : {v.merchantId}</div>
              <div>票卷價格 : ${v.price}</div>
              <div>活動時間 : {v.holdingTime}</div>
              <div>票券規格 : {v.ticketName}</div>
              <div>數量 : {v.qty} 張</div>
              <div>活動編號 : {v.event_id}</div>
              <div>
                <button
                  onClick={() => {
                    console.log(v)
                    addItem(v)
                  }}
                >
                  加入購物車
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <Link href="/cart">購物車</Link>
    </>
  )
}
