import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Card from 'react-bootstrap/Card'
import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'

export default function Confirm() {
  const { setCartItems, cartItems, setPay, pay } = useCart()
  const [state, setState] = useState({})
  //付款完成之後會轉到這裡，在使用fetch在確認訂單是否有支付成功
  const router = useRouter()
  //移除使用的優惠券
  function delCoupon(couponID, point) {
    fetch('http://localhost:3005/api/payment-data/delete', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ couponID: couponID, point: point }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        return
      })
      .catch((err) => {
        console.log(err)
      })
  }
  //寄出訂購成功的email
  function mail(orderID, tickCode) {
    fetch('http://localhost:3005/api/email/send', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ orderID, tickCode }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        return
      })
      .catch((err) => {
        console.log(err)
      })
  }
  async function qrCode(orderID) {
    const data = await fetch(
      `http://localhost:3005/api/qrcode/data?orderID=${orderID}`,
      {
        method: 'GET',
      }
    )
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(data)
    let arr = JSON.parse(data[0].order_info)
    arr.map((e) => {
      let qty = e.qty
      let eventID = e.eventId
      let eventOptionId = e.eventOptionId
      let holdingTime = e.holdingTime
      for (let i = 0; i < qty; i++) {
        fetch(`http://localhost:3005/api/qrcode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventID,
            orderID,
            eventOptionId,
            holdingTime,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res.tickCode)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    mail(orderID)
  }
  function handleCheckout() {
    // 將符合條件的項目從 cartItems 中移除
    // 過濾掉支付清單中的項目
    const updatedcartItems = cartItems
      .filter((item) => !pay.some((p) => p.id === item.id))
      // 如果商家中的票券不為空，則返回該商家
      .filter(Boolean) // 去除為空的商家
    // 將更新後的 cartItems 存回 localStorage
    window.localStorage.setItem('cartItems', JSON.stringify(updatedcartItems))
    setCartItems(updatedcartItems)
    setPay([])
  }

  useEffect(() => {
    if (router.isReady) {
      let transactionId = ''
      let orderID = router.query.orderID
      if (!orderID) {
        window.location.replace('http://localhost:3000/')
        return
      }
      let url = `http://localhost:3005/api/payment/confirm?transactionId=${transactionId}&orderID=${orderID}`
      let couponID = router.query.couponID
      let point = router.query.point
      if (router.query.transactionId) {
        transactionId = router.query.transactionId
        url = `http://localhost:3005/api/payment/confirm?transactionId=${transactionId}&orderID=${orderID}`
      }

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          //成功之後將優惠券及點數扣除
          setState(response)
          delCoupon(couponID, point)
          qrCode(orderID)
          handleCheckout()
          return response
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [router.isReady])

  return (
    <>
      {state.result?.returnCode == '0000' && (
        <Card className="text-center ">
          <Card.Header>完成付款</Card.Header>
          <Card.Body>
            <Card.Title>您的訂單編號為</Card.Title>
            <Card.Text className="mb-3">{state.result.info.orderId}</Card.Text>
            <Link
              className="btn btn-primary"
              href={'http://localhost:3000/'}
              variant="primary"
            >
              回到主頁
            </Link>
          </Card.Body>
        </Card>
      )}
      <style global jsx>
        {`
          main > .container {
            padding: 60px 15px 0;
          }
        `}
      </style>
    </>
  )
}
