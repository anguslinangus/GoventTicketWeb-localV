import React, { use, useEffect, useState } from 'react'
import ProductInfo from '@/components/payment/product-info/index.js'
import DefaultLayout from '@/components/layout/default-layout'
import PaymentForm from '@/components/payment/payment-Form'
import { useCart } from '@/hooks/use-cart'
import MoneyInfo from '@/components/payment/money-info'

export default function Payment() {
  //總金額
  const [money, setMoney] = useState(0)
  console.log(money)
  //點數及優惠券的值
  const [discount, setDiscount] = useState({
    point: 0,
    coupon: { name: '', value: 0, id: '' },
  })
  const [couponMoney, setCouponMoney] = useState(0)
  //點數及優惠券是否被勾選
  const [discountState, setDiscountState] = useState({
    point: false,
    coupon: false,
  })

  //購物車資料
  const [productData, setProductData] = useState([])
  // 從 localStorage 中獲取 MtItems 資料
  const { cartItems } = useCart()
  // 過濾出所有符合條件的項目
  const news = cartItems.filter((merchant) => {
    return merchant.checked === true
  })
  //計算總金額
  const TotalPrice = () => {
    let total = 0
    news.forEach((event) => {
      total += event.qty * event.price
    })
    return total
  }
  //計算回饋的點數
  const redeem = () => {
    let total = money
    let point = Math.floor(total * 0.05)
    return point
  }
  //計算折價
  const coupon = () => {
    let total = TotalPrice()
    let coupon = discount.coupon.value
    if (coupon > 1) {
      setCouponMoney(coupon)
      return coupon
    }
    if (coupon == 0) {
      setCouponMoney(0)
      return 0
    }
    let result = total - total * coupon
    setCouponMoney(result)
    return result
  }

  //監聽是否有輸入優惠券或折抵金額
  useEffect(() => {
    let TotalMoney = TotalPrice()
    switch (true) {
      case discountState.coupon == false && discountState.point == true:
        TotalMoney = TotalMoney - discount.point
        setMoney(TotalMoney)
        break
      case discountState.point == false && discountState.coupon == true:
        TotalMoney = TotalMoney - coupon()
        setMoney(TotalMoney)
        break
      case discountState.point == false && discountState.coupon == false:
        setMoney(TotalMoney)
        break
      case discount.point === '':
        setMoney(TotalPrice())
        if (discount.coupon.value !== 0) {
          setMoney(TotalPrice() - coupon())
        }
        break
      case discountState.point == true && discountState.coupon == true:
        TotalMoney = TotalMoney - coupon() - discount.point
        setMoney(TotalMoney)
        break
    }
    if (TotalMoney <= 0) {
      alert('金額不可為負數')
    }
  }, [discount, discountState])

  //初始化設定
  useEffect(() => {
    let TotalMoney = TotalPrice()
    setMoney(TotalMoney)
    setProductData(news)
    console.log(money)
  }, [])
  return (
    <>
      <div className="row m-5  ">
        <div className="col-lg-8 cart-area">
          <h3 className="bg-bg-gray-secondary rounded-3 py-3 px-4">訂單明細</h3>
          {/* 商品詳情 */}
          <ProductInfo productData={productData} />

          {/* 會員資料&折抵&付款資訊 */}
          <PaymentForm
            setDiscount={setDiscount}
            setDiscountState={setDiscountState}
            discount={discount}
            money={money}
            productData={productData}
            discountState={discountState}
            redeem={redeem}
            coupon={coupon}
            couponMoney={couponMoney}
            TotalPrice={TotalPrice}
            setMoney={setMoney}
          />
        </div>
        {/* 金額資訊 */}
        <div className="col-lg-4 ">
          <div
            className="bg-bg-gray-secondary  rounded-4 py-3 px-4 sticky-top d-none d-lg-block"
            style={{ top: '100px' }}
          >
            <MoneyInfo
              productData={productData}
              discount={discount}
              discountState={discountState}
              couponMoney={couponMoney}
              money={money}
              redeem={redeem}
            />
          </div>
        </div>
      </div>
      <style global jsx>
        {`
          body {
            background-color: #151515;
            color: #fff;
          }
          main > .container {
            padding: 60px 15px 0;
          }
        `}
      </style>
    </>
  )
}
Payment.getLayout = function (page) {
  return <DefaultLayout title="Payment">{page}</DefaultLayout>
}
