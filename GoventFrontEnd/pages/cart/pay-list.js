import React, { useEffect, useState } from 'react'
import Link from 'next/link'
//勾子
import { useCart } from '@/hooks/use-cart'

export default function PayList() {
  //引入勾子
  const { setCartItems } = useCart()

  // 從 localStorage 中獲取 cartItems 資料
  var cartItemsString =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('cartItems')
      : '[]'

  // 將字串轉換為 JavaScript 物件
  var cartItems = JSON.parse(cartItemsString)
  // console.log(cartItems)
  //存入狀態
  const [pay, setPay] = useState([])
  // console.log(pay)

  // 過濾出所有符合條件的項目
  const news = cartItems.filter((item) => item.checked === true)

  //總價
  const TotalPrice = () => {
    let total = 0
    pay.forEach((event) => {
      total += event.qty * event.price
    })

    return total
  }
  // console.log(TotalPrice())

  const handleCheckout = () => {
    // 將符合條件的項目從 cartItems 中移除
    // 過濾掉支付清單中的項目
    const updatedcartItems = cartItems
      .filter((item) => !pay.some((p) => p.id === item.id))
      // 如果商家中的票券不為空，則返回該商家

      .filter(Boolean) // 去除為空的商家
    // 將更新後的 cartItems 存回 localStorage
    window.localStorage.setItem('cartItems', JSON.stringify(updatedcartItems))
    setCartItems(updatedcartItems)
    // 清空 pay 狀態
    setPay([])
  }

  //生命週期
  useEffect(() => {
    setPay(news)
  }, []) // 只在 news 更新時執行 setPay

  return (
    <>
      <h2 className="text-white">結帳內容</h2>
      {pay.map((v, i) => {
        return (
          <li className="text-white" key={v.id}>
            <div className="">活動名稱 : {v.eventName}</div>
            <div>商家ID : {v.merchantId}</div>
            <div>票卷價格 : ${v.price}</div>
            <div>活動時間 : {v.holdingTime}</div>
            <div>票券規格 : {v.ticketName}</div>
            <div>數量 : {v.qty} 張</div>
          </li>
        )
      })}
      <h3 className="text-white">總價:{TotalPrice()}</h3>

      {/* <Link href="/cart">確認結帳</Link> */}

      <button onClick={() => handleCheckout()}>確認結帳</button>
    </>
  )
}
