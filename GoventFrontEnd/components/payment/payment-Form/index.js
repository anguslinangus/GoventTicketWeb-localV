/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import CheckboxInput from '../checkbox-input'
import Image from 'react-bootstrap/Image'
import GoventToast from '@/components/toast'
import MoneyInfo from '@/components/payment/money-info'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/use-auth'

export default function PaymentForm({
  setDiscount = () => {},
  setDiscountState = () => {},
  discount = {},
  discountState = {},
  money,
  productData = {},
  redeem = () => {},
  couponMoney = 0,
  TotalPrice = () => {},
  setMoney = () => {},
}) {
  console.log(discount)
  //引入會員資料hook
  const { auth } = useAuth()
  //使用react-hook-form套件檢查form表單
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm()
  //結帳之後將資料傳送至後端
  const postSubmit = (data) => {
    console.log(productData)
    let discountObj = discount
    //判斷是否有勾選優惠或點數折抵
    switch (true) {
      case discountState.point == false && discountState.coupon == true:
        discountObj = { ...discount, point: '0' }
        break
      case discountState.point == true && discountState.coupon == false:
        discountObj = { ...discount, coupon: { name: '', value: '0', id: '0' } }
        break
      case discountState.coupon == false && discountState.coupon == false:
        discountObj = {
          ...discount,
          point: '0',
          coupon: { name: '', value: '0', id: '0' },
        }
        break
      default:
        break
    }

    let newPoint = pointData - discountObj.point + redeem()
    let result = {
      ...data,
      money: money,
      productData: productData,
      redeem: redeem(),
      discount: discountObj,
      newPoint: newPoint,
      userID: auth.user.id,
    }
    console.log(data.paymentType)
    fetch(`http://localhost:3005/api/payment/${data.paymentType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((response) => {
        if (response.html) {
          let formString = response.html
          document.body.insertAdjacentHTML('afterend', formString)
          document.getElementById('_form_aiochk').submit()
        }
        if (response.url) {
          window.location.replace(response.url)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //確認是否有勾選與會員資料相同
  const numberValue = useRef(null)
  function changeNumberValue() {
    if (numberValue.current.checked) {
      let newAuth = auth.user
      setValue('userName', newAuth.name)
      setValue('userGender', newAuth.gender)
      setValue('birthday', newAuth.birthday)
      setValue('phoneNumber', newAuth.phone)
      setValue('email', newAuth.username)
    }
  }

  //監聽使用者輸入優惠券表單欄位
  function formChange(e) {
    if (e.target.name === 'coupon') {
      let selectedIndexID = e.target.options[e.target.selectedIndex].id
      let setConnectionData = {
        ...discount,
        coupon: {
          name: e.target.options[e.target.selectedIndex].text,
          value: e.target.value,
          id: selectedIndexID,
        },
      }
      setDiscount(setConnectionData)
      return
    }

    if (e.target.name == 'point') {
      let setConnectionData = { ...discount, [e.target.name]: e.target.value }
      let value = e.target.value
      if (value < 0 || value > pointData) {
        alert('超過會員點數範圍')
        setConnectionData = { ...discount, [e.target.name]: '0' }
        setDiscount(setConnectionData)
        pointInputRef.current.value = ''
        return
      }
      setDiscount(setConnectionData)

      return
    }
  }
  //監聽點數及優惠券是否被勾選
  const pointInputRef = useRef(null)
  const couponInputRef = useRef(null)
  //使用useState更改disabled的狀態，false為增加屬性true為關閉屬性
  const [pointDisabledValue, setPointDisabledValue] = useState(false)
  const [couponDisabledValue, setCouponDisabledValue] = useState(false)
  //從子元件傳遞過來true或是false的值
  function handlePointCheckboxChange(checkedValue) {
    setPointDisabledValue(checkedValue)
  }
  //從子元件傳遞過來true或是false的值
  function handleCouponCheckboxChange(checkedValue) {
    setCouponDisabledValue(checkedValue)
  }

  //使用Effect監聽值，當input打勾時執行add或remove，disabled屬性
  useEffect(() => {
    pointInputRef.current?.removeAttribute('disabled', true)
    if (pointDisabledValue === false) {
      pointInputRef.current?.setAttribute('disabled', true)
    }
    couponInputRef.current.removeAttribute('disabled', true)
    if (couponDisabledValue === false) {
      couponInputRef.current.setAttribute('disabled', true)
    }
    let state = {
      ...discountState,
      point: pointDisabledValue,
      coupon: couponDisabledValue,
    }
    setDiscountState(state)
  }, [pointDisabledValue, couponDisabledValue])

  //控制input radio選項，選擇信用卡時跳出填入信用卡資訊的欄位
  const [radioValue, setRadioValue] = useState('')
  //監聽使用者選擇欄位的id
  function changeValue(e) {
    let targetID = e.target.id
    setRadioValue(targetID)
  }
  //儲存輸入信用卡的卡號內容
  const [cardValue, setCardValue] = useState('')
  //判斷是否要增加"-"
  const handleChange = (e) => {
    let inputValue = e.target.value.replace(/[^\d]/g, '') //只能輸入數字
    let formattedValue = ''
    for (let i = 0; i < inputValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += '-'
      }
      formattedValue += inputValue[i]
    }
    setCardValue(formattedValue)
  }
  //檢查信用卡input刪除到"-"前面時刪除"-"
  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      const cursorIndex = e.target.selectionStart
      if (cardValue[cursorIndex - 1] === '-') {
        const newValue =
          cardValue.slice(0, cursorIndex - 1) + cardValue.slice(cursorIndex)
        setCardValue(newValue)
        e.target.setSelectionRange(cursorIndex - 1, cursorIndex - 1)
      }
    }
  }
  const [couponData, setCouponData] = useState([])
  const [pointData, setPointData] = useState(0)
  console.log(couponData)
  //拿取會員的優惠券及點數資料
  useEffect(() => {
    console.log(money)
    fetch('http://localhost:3005/api/payment-data/number', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        let money = TotalPrice()
        let point = Number(response.data.point[0].point)
        setPointData(point)
        let coupon = response.data.coupon
        console.log(coupon)
        coupon = coupon.filter((e) => e.price_min < money)
        console.log(coupon)
        setCouponData(coupon)
        return
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  useEffect(() => {
    console.log(money)
    if (money <= 0) {
      let discountObj = {
        ...discount,
        point: '0',
        coupon: { name: '', value: '0', id: '0' },
      }
      pointInputRef.current.value = ''
      couponInputRef.current.value = 0
      setDiscount(discountObj)
      setMoney(TotalPrice())
    }
  }, [money])
  return (
    <>
      <Form onSubmit={handleSubmit(postSubmit)} method="post">
        {/* 聯絡資料 */}
        <div className="connection-data mb-3 ">
          <div>
            <h5>
              <i className="bi bi-person-fill"></i>聯絡資料
            </h5>
          </div>
          <div className="row bg-bg-gray-secondary  rounded-4 py-3 px-4 gx-0">
            {/* 姓名 */}
            <Form.Group
              className="mb-3 col-md-3 px-2"
              controlId="formGroupEmail"
            >
              <Form.Label>姓名</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入姓名"
                className="bg-bg-gray  placeholder-text text-white-50 validate"
                name="userName"
                // value={number.numberName}
                {...register('userName', {
                  required: true,
                })}
                aria-invalid={errors.userName ? 'true' : 'false'}
              />
              {errors.userName?.type === 'required' && (
                <p role="alert" className="text-danger pt-1">
                  請輸入姓名
                </p>
              )}
            </Form.Group>
            {/* 性別 */}
            <Form.Group className="mb-3 col-md-3 px-2" controlId="formGroup">
              <Form.Label>性別</Form.Label>
              <Form.Select
                aria-label="Default select example"
                className="bg-bg-gray text-white-50 validate"
                name="userGender"
                {...register('userGender', {
                  required: true,
                })}
                aria-invalid={errors.userGender ? 'true' : 'false'}
              >
                <option value="">選擇</option>
                <option value="0">男</option>
                <option value="1">女</option>
              </Form.Select>
              {errors.userGender?.type === 'required' && (
                <p role="alert" className="text-danger pt-1">
                  請輸入性別
                </p>
              )}
            </Form.Group>
            {/* 生日 */}
            <Form.Group
              className="mb-3 col-md-6 px-2"
              controlId="formGroupEmail"
            >
              <Form.Label>生日</Form.Label>
              <Form.Control
                type="date"
                className="bg-bg-gray text-white-50  validate"
                name="birthday"
                {...register('birthday', { required: true })}
                aria-invalid={errors.birthday ? 'true' : 'false'}
              />

              {errors.birthday?.type === 'required' && (
                <p role="alert" className="text-danger pt-1">
                  請輸入生日
                </p>
              )}
            </Form.Group>
            {/* 手機 */}
            <Form.Group
              className="mb-3 col-md-6 px-2"
              controlId="formGroupEmail"
            >
              <Form.Label>手機</Form.Label>
              <Form.Control
                type="text"
                placeholder="0912345678"
                className="bg-bg-gray text-white-50 placeholder-text validate"
                name="phoneNumber"
                {...register('phoneNumber', {
                  required: '請輸入手機',
                  pattern: {
                    value: /^09\d{2}-?\d{3}-?\d{3}$/,
                    message: '請輸入正確手機格式',
                  },
                })}
              />
              {errors.phoneNumber && (
                <p role="alert" className="text-danger pt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </Form.Group>
            {/* 信箱 */}
            <Form.Group
              className="mb-3 col-md-6 px-2"
              controlId="formGroupEmail"
            >
              <Form.Label>信箱</Form.Label>
              <Form.Control
                type="text"
                placeholder="輸入email"
                className="bg-bg-gray  placeholder-text text-white-50 validate"
                name="email"
                {...register('email', {
                  required: '請輸入信箱',
                  pattern: {
                    value: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: '請輸入正確信箱格式',
                  },
                })}
              />
              {errors.email && (
                <p role="alert" className="text-danger pt-1">
                  {errors.email.message}
                </p>
              )}
            </Form.Group>
            {/* 與會員註冊資料相同 */}
            <div className="form-check mb-3 mx-2">
              <input
                ref={numberValue}
                className="form-check-input"
                type="checkbox"
                id="gridCheck"
                onChange={changeNumberValue}
              />
              <label className="form-check-label" htmlFor="gridCheck">
                與會員註冊資料相同
              </label>
            </div>
          </div>
        </div>
        {/* 折抵方式 */}
        <div className="points-coupons-container d-lg-flex d-block row mb-3 gx-0">
          <div>
            <h5>
              <i className="bi bi-wallet-fill"></i>付款方式
            </h5>
          </div>
          <div className="point bg-bg-gray-secondary rounded-4  col me-lg-2 py-3 px-4 mb-2">
            <div className="point-title  mb-1">
              <CheckboxInput
                Content={`我要使用點數折抵（目前尚餘${pointData}點）`}
                inputID="point"
                change={handlePointCheckboxChange}
              />
            </div>
            <div className="point-input">
              <div className="mb-3">
                <label htmlFor="pointInput" className="form-label sm-p">
                  折抵數量
                </label>
                <input
                  type="number"
                  className="form-control bg-bg-gray  text-white-50 placeholder-text"
                  name="point"
                  id="pointInput"
                  placeholder="輸入數量"
                  ref={pointInputRef}
                  onChange={formChange}
                />
              </div>
            </div>
          </div>
          <div className="coupon bg-bg-gray-secondary rounded-4 col ms-lg-2 py-3 px-4">
            <div className="point-title d-flex">
              <CheckboxInput
                Content={'我要使用優惠卷'}
                inputID="coupon"
                change={handleCouponCheckboxChange}
              />
            </div>
            <div className="point-input">
              <div className="mb-3">
                <label htmlFor="couponInput" className="form-label sm-p">
                  優惠卷
                </label>
                <select
                  className="form-select bg-bg-gray text-white-50 "
                  aria-label="Default select example"
                  defaultValue="1"
                  ref={couponInputRef}
                  name="coupon"
                  onChange={formChange}
                >
                  <option value="0">選擇優惠券</option>
                  {couponData.map((v, i) => {
                    console.log()
                    return (
                      <>
                        <option key={i} value={v.discount_valid} id={v.id}>
                          {v.coupon_name}
                        </option>
                      </>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* 付款方式 */}
        <div className="payment-type  py-3 px-4 rounded-4 mb-4 bg-bg-gray-secondary">
          {/* 信用卡 */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="radio"
              name="paymentType"
              id="creditCard"
              value="creditCard"
              {...register('paymentType', {
                required: true,
                onChange: changeValue,
              })}
            />
            <label className="form-check-label" htmlFor="creditCard">
              信用卡 / 簽帳金融卡
            </label>
            {/* 輸入信用卡內容 */}
            {radioValue == 'creditCard' && (
              <GoventToast radioValue={radioValue}>
                <div className="d-lg-flex d-block">
                  <div className="col-md-4 px-2">
                    <label
                      htmlFor="cardNumber"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      信用卡號碼
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control bg-bg-gray text-white-50  placeholder-text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardValue}
                      onKeyDown={handleKeyDown}
                      maxLength={19}
                      {...register('cardNumber', {
                        required: '請輸入信用卡號碼',
                        minLength: {
                          value: 19,
                          message: '請輸入16為號碼',
                        },
                        onChange: handleChange,
                      })}
                    />
                    {errors.cardNumber && (
                      <p role="alert" className="text-danger pt-1">
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="col-md-4 px-2 ">
                    <Form.Group
                      className="mb-3 col-md-3 w-100"
                      controlId="formGroup"
                    >
                      <Form.Label className="form-label sm-p text-normal-gray-light ">
                        有效期限
                      </Form.Label>
                      <div className="d-flex">
                        <div className="col">
                          <Form.Select
                            className="me-1 bg-bg-gray text-white-50  placeholder-text"
                            {...register('exDateMonth', {
                              required: '請填入月',
                            })}
                          >
                            <option value="">月</option>
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </Form.Select>
                          {errors.exDateMonth?.type === 'required' && (
                            <p role="alert" className="text-danger pt-1 ">
                              {errors.exDateMonth.message}
                            </p>
                          )}
                        </div>
                        <div className="col">
                          <Form.Select
                            className="ms-1 bg-bg-gray text-white-50  placeholder-text"
                            {...register('exDateYear', {
                              required: '請填入年份',
                            })}
                          >
                            <option value="">年</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                            <option value="2031">2031</option>
                            <option value="2032">2032</option>
                            <option value="2033">2033</option>
                            <option value="2034">2034</option>
                            <option value="2035">2035</option>
                          </Form.Select>
                          {errors.exDateYear?.type === 'required' && (
                            <p role="alert" className="text-danger pt-1 ms-1">
                              {errors.exDateYear.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-4 px-2">
                    <Form.Label
                      htmlFor="securityCode"
                      className="form-label sm-p text-normal-gray-light"
                    >
                      安全碼
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control bg-bg-gray text-white-50  placeholder-text"
                      id="securityCode"
                      name="securityCode"
                      maxLength={3}
                      {...register('securityCode', {
                        required: '請輸入安全碼',
                        minLength: {
                          value: 3,
                          message: '請輸入安全碼三位數',
                        },
                      })}
                    />
                    {errors.securityCode && (
                      <p role="alert" className="text-danger pt-1">
                        {errors.securityCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </GoventToast>
            )}
          </div>
          {/* LINE PAY */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="radio"
              name="paymentType"
              id="LinePay"
              value="line-pay"
              {...register('paymentType', {
                required: true,
                onChange: changeValue,
              })}
            />
            <label className="form-check-label" htmlFor="LinePay">
              <Image src="/line-pay/LINE Pay_logo-02.png" />
            </label>
          </div>
          {/* ECpay */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="radio"
              name="paymentType"
              id="ECpay"
              value="ECpay"
              {...register('paymentType', {
                required: true,
                onChange: changeValue,
              })}
            />
            <label className="form-check-label" htmlFor="ECpay">
              <Image src="/ECpay/ECpay.png" />
            </label>
          </div>
          {errors.paymentType && (
            <p role="alert" className="text-danger pt-1">
              請選擇付款方式
            </p>
          )}
        </div>
        {/* 訂單金額 手機版 */}
        <div className="bg-bg-gray-secondary  rounded-4 py-3 px-4  d-lg-none d-block mb-3">
          <MoneyInfo
            productData={productData}
            discount={discount}
            discountState={discountState}
            couponMoney={couponMoney}
            money={money}
            redeem={redeem}
          />
        </div>
        {/* 送出資料 */}
        <div className="form-check agree d-flex justify-content-center mb-2 align-items-center">
          <input
            className="form-check-input me-2"
            type="checkbox"
            id="gridCheck"
            name="agree"
            {...register('agree', { required: true })}
            aria-invalid={errors.agree ? 'true' : 'false'}
          />

          <label className="form-check-label" htmlFor="gridCheck">
            我同意網站 <span className="text-warning">服務條款</span> 及
            <span className="text-warning">隱私權政策</span>
          </label>
        </div>
        {errors.agree?.type === 'required' && (
          <p role="alert" className="text-danger text-center mb-2">
            請勾選同意
          </p>
        )}
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary h6 fw-bolder text-white"
            style={{ width: '400px', height: '60px', borderRadius: '15px' }}
          >
            確認付款
          </button>
        </div>

        {/* <input type="hidden" {...register('money')} value={money} /> */}
      </Form>
      <style global jsx>{`
        .placeholder-text::placeholder {
          color: gray;
        }
        input {
          color-scheme: dark;
        }
      `}</style>
    </>
  )
}
