import React, { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import EventsRecommend from '@/components/events-recommend'
import Calendar from '@/components/product/date'
import FavIcon from '@/components/layout/list-layout/fav-icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from '@/hooks/use-cart'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { motion } from 'framer-motion'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useAuth } from '@/hooks/use-auth'
import toastStyle from '@/components/user/custom-toastify.module.css'

export default function Detail() {
  //引入鉤子
  const { addItem, items } = useCart()
  const router = useRouter()
  const {
    query: { pid },
  } = useRouter()
  const HtmlRenderer = ({ htmlContent }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  }

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { auth } = useAuth()

  const MySwal = withReactContent(Swal)

  const [eventInfo, setEventInfo] = useState([])
  const [ticketInfo, setTicketInfo] = useState([])
  const [optionTicket, setOptionTicket] = useState([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [isClicked, setIsClicked] = useState(false)

  //設售票期間的日曆狀態
  const [sellStartDate, setSellStartDate] = useState('')
  const [sellEndDate, setSellEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [sellTime, setSellTime] = useState('')

  //存取選取日期和時間
  const [selectDate, setSelectDate] = useState('')
  const [selectTime, setSelectTime] = useState('')
  const [all, setAll] = useState([])
  // console.log(selectDate)

  //接受list來的id 並且fetch相對應的活動資料(包含票卷資料庫)
  //因list以id當key，後續可同步修改為pid當key?
  const getProducts = async (pid) => {
    try {
      const res = await fetch(`http://localhost:3005/api/events/${pid}`)
      const data = await res.json()
      // console.log('Received data:', data)
      setEventInfo(data.data.posts) //轉換成eventInfo
      // setTicketInfo(data.data.posts.map(event => ({ ...event, qty: 1 }))) //轉換成ticketInfo並添加qty

      const startDate = data?.data.posts[0].start_date
      setStartDate(startDate)
      setEndDate(data?.data.posts[0].end_date)

      setSellStartDate(data?.data.posts[0].sell_start_date)
      setSellEndDate(data?.data.posts[0].sell_end_date)

      let date3, time3
      if (startDate.includes('T')) {
        ;[date3, time3] = startDate.split('T')
        time3 = time3.substring(0, 5)
      }
      setSellTime(time3)
      console.log(time3)

      //進入前面前先篩入預設值//anne改這
      setSelectTime(time3)
    } catch (e) {
      console.log(e)
    }
  }

  //回傳fetch到的資料
  useEffect(() => {
    if (router.isReady) {
      const { pid } = router.query
      console.log('PID', pid)
      getProducts(pid)
    }
  }, [router.isReady])

  useEffect(() => {
    if (ticketInfo && selectDate) {
      getAll(ticketInfo, selectDate)
    }
  }, [ticketInfo, selectDate])

  const getOptionTickets = async (pid) => {
    try {
      const res = await fetch(`http://localhost:3005/api/events/option/${pid}`)
      const data = await res.json()
      setTicketInfo(data.data.result.map((event) => ({ ...event, qty: 1 })))

      let prices = data.data.result.map((post) => post.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      setMinPrice(minPrice)
      setMaxPrice(maxPrice)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (pid) {
      getOptionTickets(pid)
      // console.log(ticketInfo)
    }
  }, [pid])

  const getAll = (ticketInfo, selectDate) => {
    console.log(selectDate)
    // 使用 Date 物件來解析原始日期字串
    const date = new Date(selectDate)
    // 取得年、月、日資訊
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`
    console.log(selectTime)

    const holdingTime = `${formattedDate} ${selectTime}`
    console.log(holdingTime)

    //   let allTickets = [];

    //   for (let i = 0; i < ticketInfo.length; i++) {
    //     let ticket = ticketInfo[i];
    //     allTickets.push({
    //       id: ticket.id,
    //       merchantId: ticket.merchat_id,
    //       eventTypeId: ticket.event_type_id,
    //       eventName: ticket.event_name,
    //       holdingTime: holdingTime,
    //       images: ticket.banner,
    //       ticketName: ticket.option_name,
    //       price: ticket.price,
    //       qty: ticket.qty,
    //       eventId: ticket.event_id,
    //       eventOptionId: ticket.option_id,
    //     });
    //   }

    //   setAll(allTickets);
    // }
    setAll([
      {
        id: ticketInfo[0].id,
        merchantId: ticketInfo[0].merchat_id,
        eventTypeId: ticketInfo[0].event_type_id,
        eventName: ticketInfo[0].event_name,
        holdingTime: holdingTime, //*
        images: ticketInfo[0].banner,
        ticketName: ticketInfo[0].option_name,
        price: ticketInfo[0].price,
        qty: ticketInfo[0].qty, //*
        eventId: ticketInfo[0].event_id,
        eventOptionId: ticketInfo[0].option_id,
      },
    ])
  }

  // console.log(all)

  // 假設初始狀態是未選擇
  const [selected, setSelected] = useState(0)

  const handleSelection = (index) => {
    setSelected(index) // 切換選擇狀態
    console.log(selected)
  }

  const handleTime = () => {
    setIsClicked(true)
    setSelectTime(sellTime)
  }

  const handleDecrease = (items, id) => {
    const newItems = ticketInfo.map((v) => {
      if (id === v.id && v.qty > 1) {
        return { ...v, qty: v.qty - 1 }
      } else {
        return v
      }
    })
    setTicketInfo(newItems)
  }
  const handleIncrease = (items, id) => {
    const newItems = ticketInfo.map((v) => {
      if (id === v.id) {
        return { ...v, qty: v.qty + 1 }
      } else {
        return v
      }
    })
    setTicketInfo(newItems)
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <>
        <section>
          {eventInfo.map((eventInfo, index) => (
            <div key={index} className=" d-flex p-4 d-none d-xxl-inline-flex">
              <p>
                首頁 <i className="bi bi-chevron-right"></i>
              </p>
              <p>
                {eventInfo.activity_name}
                <i className="bi bi-chevron-right"></i>
              </p>
              <p className="text-primary-light">
                {eventInfo.event_name} <i className="bi bi-chevron-right"></i>
              </p>
            </div>
          ))}
          {/* RWD 主頁按鈕 - 已移除不必要的導航按鈕 */}
          {/* 主頁圖片 */}
          <div>
            <img
              src={`/images/banner/${
                eventInfo[0]?.banner?.split(',')[0]
              }`}
              className="object-fit-cover"
              alt=""
            />
          </div>
        </section>
        {/* 活動資訊 */}
        {eventInfo.map((eventInfo) => (
          <main key={eventInfo.id}>
            <div className="wrapper">
              <section className="title">
                <div
                  key={eventInfo.id}
                  className="d-flex align-items-center justify-content-between mt-3"
                >
                  <h5 className="border-5 border-start border-primary px-2">
                    {eventInfo.event_name}
                  </h5>
                  {/* <button
                    type="button"
                    className="store btn btn-primary-deep-50 d-none d-xxl-block"
                  > */}
                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <FavIcon
                      pid={eventInfo.pid}
                      events={eventInfo[0]}
                      setEvents={setEventInfo[0]}
                    />
                  </div>
                  {/* </button> */}
                </div>
                <div>
                  <h3 className="my-4">{eventInfo.event_name}</h3>
                  <h6 className="text-normal-gray-light">
                    <i className="bi bi-calendar me-2 d-none d-xxl-inline-flex" />
                    {eventInfo.start_date.substring(0, 10)}~
                    {eventInfo.end_date.substring(0, 10)}
                  </h6>

                  <h6>
                    <i className="bi bi-geo-alt me-2 d-none d-xxl-inline-flex" />
                    {/* 導向 Google 地圖上該地點的頁面。使用 encodeURIComponent() 函數來對地點進行編碼，以確保 URL 的正確性。target="_blank" 和 rel="noopener noreferrer" 屬性用於在新標籤中打開連結。 */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        eventInfo.place
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white border-bottom"
                    >
                      {eventInfo.place}
                    </a>
                  </h6>

                  <p className="mx-4 text-secondary-02">{eventInfo.address}</p>
                  <hr className="d-none d-xxl-block" />
                </div>
                <div className="d-flex text-normal-gray-light">
                  <h6>
                    <i className="bi bi-exclamation-triangle me-2" />
                    禁止取消
                  </h6>
                  <h6 id="eventIntro4">
                    <i className="bi bi-box2 mx-2" />
                    電子票證
                  </h6>
                </div>
                <hr />
              </section>

              <div className="d-flex align-items-center mt-5">
                <h4 className="border-5 border-start border-primary px-2">
                  選擇方案
                </h4>
              </div>
              {/* 票券種類 */}
              {/* map跑出來 */}
              <section>
                {ticketInfo.map((v, i) => {
                  return (
                    <div key={i}>
                      <div className="row seat1 mt-3">
                        <h4 className="col-lg-9 col-sm-6">{v.option_name}</h4>
                        <h4 className="col-lg-2 col-sm-4">
                          NT$ {parseInt(v.price).toLocaleString()}
                        </h4>
                        <button
                          className="store col-lg-1 col-sm-2 btn btn-primary-deep"
                          onClick={() => {
                            handleSelection(i)
                          }}
                        >
                          {selected == i ? '已選擇' : '選擇'}
                        </button>
                        {selected == i && (
                          <>
                            <div className="d-flex mt-4 d-none d-xxl-inline-flex">
                              <h5 className="me-5">憑證兌換期限</h5>
                              <p className="ms-1">
                                需要按照預訂日期及當天開放時間內兌換，逾期失效
                              </p>
                            </div>
                            <div className="d-flex mt-4 d-none d-xxl-inline-flex">
                              <h5 className="me-5">取消政策</h5>
                              <p className="ms-5 mb-3">
                                商品一經訂購完成後，即不可取消、更改訂單，亦不得請求退款
                                <br />
                                供應商需2-5個工作天進行取消流程，依照您購買的商品取消政策收取手續費，並於取消流程完成後14個工作天內退款。
                              </p>
                            </div>
                            <hr className="d-none d-xxl-block" />
                            <div className="d-flex justify-content-between d-none d-xxl-inline-flex choice-date">
                              <div className="">
                                <h5 className="mb-4">選擇日期</h5>
                                <div className="text-center">
                                  <Calendar
                                    sellStartDate={startDate}
                                    sellEndDate={endDate}
                                    setSelectDate={setSelectDate}
                                  />
                                </div>
                              </div>
                              <div className="d-flex flex-column">
                                <h5 className="mb-4">選擇時間</h5>
                                <div>
                                  <button
                                    className={`store fs-5 p-2 px-4 btn ${
                                      isClicked
                                        ? 'btn-warning'
                                        : 'btn-primary-deep'
                                    }`}
                                    onClick={handleTime}
                                    required
                                  >
                                    {sellTime}
                                  </button>
                                </div>
                                <h5 className="my-3">數量</h5>
                                <div className="d-flex align-items-center">
                                  <i
                                    type="button"
                                    className="bi bi-dash-circle me-2 icon"
                                    onClick={() => {
                                      handleDecrease(ticketInfo, v.id)
                                    }}
                                  />
                                  <h5 className="px-3 py-2 bg-dark rounded m-0">
                                    {v.qty}
                                  </h5>
                                  <i
                                    type="button"
                                    className="bi bi-plus-circle ms-2 icon"
                                    onClick={() => {
                                      handleIncrease(ticketInfo, v.id)
                                    }}
                                  />
                                </div>
                                <div className="d-flex mt-5 mb-4">
                                  <h5 className="">總金額</h5>
                                  <h4 className="dollar">
                                    NT$ {v.price * v.qty}
                                  </h4>
                                </div>

                                {!auth.isAuthenticated ? (
                                  <div className="d-flex justify-content-end">
                                    <button
                                      className="store fs-5 p-2 btn btn-primary-deep"
                                      onClick={() => {
                                        if (!isLoggedIn) {
                                          // 如果用户未登录，显示 Modal
                                          handleShow()
                                        } else {
                                          // 如果用户已登录，将商品加入购物车
                                          addItem(all[0])
                                          MySwal.fire({
                                            icon: 'success',
                                            title: '已成功加入購物車',
                                          })
                                        }
                                      }}
                                    >
                                      加入購物車
                                    </button>
                                    <Modal show={show} onHide={handleClose}>
                                      <Modal.Header
                                        closeButton
                                        className={toastStyle.myToast}
                                      >
                                        <Modal.Title className="text-white">
                                          請先登入會員才可使用購物車
                                          <p className="text-white mt-2">
                                            沒有註冊會員?
                                            <Link href="/user/signup">
                                              <span
                                                className={toastStyle.myToast}
                                              >
                                                {' '}
                                                前往註冊
                                              </span>
                                            </Link>
                                          </p>
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Footer
                                        className={`${toastStyle.myToast} border-0`}
                                      >
                                        <Link href="/user/signin">
                                          <Button variant="primary">
                                            已有會員登入
                                          </Button>
                                        </Link>
                                      </Modal.Footer>
                                    </Modal>
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-end">
                                    <button
                                      className="store fs-5 me-2 p-2 btn btn-primary-deep"
                                      onClick={() => {
                                        // 如果用户已登录，将商品加入购物车
                                        addItem(all[0])
                                        MySwal.fire({
                                          icon: 'success',
                                          title: '已成功加入購物車',
                                        })
                                      }}
                                    >
                                      加入購物車
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </section>
              <section className="row">
                {/* left bar */}
                <div className="left col-lg-8 col-sm-12">
                  <div className="d-flex align-items-center mt-5 mb-3">
                    <h4
                      id="eventIntro"
                      className="border-5 border-start border-primary px-2"
                    >
                      活動介紹
                    </h4>
                  </div>
                  <HtmlRenderer htmlContent={eventInfo.content} />
                  <div className="d-flex align-items-center mt-5">
                    <h4
                      id="eventIntro2"
                      className="border-5 border-start border-primary px-2"
                    >
                      購買須知
                    </h4>
                  </div>
                  <p className="lh-lg mt-4">
                    1.本次活動購票進場採實名制，每位會員帳號限購2張票券。
                    <br />
                    2.若購買1張票券，該張票券填寫的參加者姓名須為購票會員帳號姓名，若購買2張票券，其中1張票券填寫的參加者姓名須為購票會員帳號姓名，請於購票前先至「會員專區」→「個人資料」確認會員姓名是否與會員本人證件姓名相符且完整填寫，恕不接受購票中及購票後修改，若經查核購票當下的「會員姓名」與填寫的「參加者姓名」無一符合者，主辦單位及遠大售票有權取消該會員於此活動購買之全數票券。若因事後修改會員資料，經核對後與購票當下資訊不符合者，主辦單位及遠大售票有權取消該會員於此活動購買之全數票券。(以上紅字部分為10/27新增實名制規定)
                    <br />
                    3.一個證件號僅能購買一張票券，請勿將個人資料提供給他人，以免影響自身購買權益。
                    <br />
                    4.系統列印票券時，將帶入購票頁面填寫的參加者資料，請確實填寫每位參加者的「身分證姓名」及「身分證證字號」，外籍人士請填寫「護照姓名」及「護照號碼」，購票時請務必確認每張票券對應之參加者資料填寫正確，以免影響入場權益。
                    <br />
                    5.實名制票券的參加者「姓名」及「證件字號」如填寫有誤將不接受任何形式變更資料，僅接受退票期限內申請退票，請務必確認再進行結帳。
                    <br />
                    6.詳細實施規則請見購票頁面說明，並建議提前加入會員，於「會員專區」→「個人資料」→「信用卡資訊」登錄信用卡完成驗證手續，以便進行購票流程。
                  </p>
                  <div className="d-flex align-items-center mt-5">
                    <h4
                      id="eventIntro3"
                      className="border-5 border-start border-primary px-2"
                    >
                      使用方式
                    </h4>
                  </div>
                  <p className="my-4">
                    <i className="bi bi-dot" />
                    入場專用QRCODE將會寄送到您的會員email，或請至會員中心＞訂單＞票卷內點擊出示使用。
                  </p>
                </div>
                {/* right bar */}
                <div className="right d-none d-xxl-block col-4 pt-4 ps-5">
                  <div className="row seat1 mt-3">
                    <h5 className="col-12 mb-3">
                      {' '}
                      NT$ {minPrice}{' '}
                      {minPrice !== maxPrice ? `~ ${maxPrice}` : ''}
                    </h5>
                    <a
                      href="#eventIntro4"
                      type="button"
                      className="store col-12 btn btn-primary-deep"
                    >
                      立即購買
                    </a>
                  </div>
                  <a
                    href="#eventIntro"
                    type="button"
                    className="d-flex align-items-center mt-5"
                  >
                    <h5 className="border-5 border-start border-primary px-2 text-white">
                      活動介紹
                    </h5>
                  </a>
                  <a
                    href="#eventIntro2"
                    type="button"
                    className="d-flex align-items-center mt-3"
                  >
                    <h5 className="border-5 border-start border-primary px-2 text-white">
                      購買須知
                    </h5>
                  </a>
                  <a
                    href="#eventIntro3"
                    type="button"
                    className="d-flex align-items-center mt-3"
                  >
                    <h5 className="border-5 border-start border-primary px-2 text-white">
                      使用方式
                    </h5>
                  </a>
                </div>
              </section>
              {/* 購買須知 */}

              <section className="d-none d-xxl-inline-flex">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className=""
                >
                  <EventsRecommend />
                </motion.div>
              </section>
            </div>

            {/* RWD  */}
            {/* 按鈕 */}
            <div className="d-inline-flex d-xxl-none align-items-center justify-content-center col-12 bg-bg-gray-secondary p-3 rounded-3">
              <h5 className="col-8">NT$ {minPrice} 起</h5>
              <button
                className="store fs-6 fw-bold p-2 btn btn-primary col-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                選擇規格<i className="bi bi-chevron-bar-up"></i>
              </button>
            </div>
            {/* 彈跳視窗 */}

            <div
              className="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content bg-bg-gray-secondary">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      選擇規格
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  {ticketInfo.map((v, i) => {
                    return (
                      <div key={i}>
                        <div className="modal-body">
                          <div className="d-flex justify-content-between seat1 my-4">
                            <h5 className="">{v.option_name}</h5>
                            <h5 className="">
                              NT$ {parseInt(v.price).toLocaleString()}
                            </h5>
                            <button
                              className="store col-2 btn btn-primary-deep"
                              onClick={() => {
                                handleSelection(i)
                              }}
                            >
                              {selected == i ? '已選擇' : '選擇'}
                            </button>
                          </div>

                          {selected == i && (
                            <>
                              <div className="text-center mx-4">
                                <Calendar
                                  sellStartDate={startDate}
                                  sellEndDate={endDate}
                                  setSelectDate={setSelectDate}
                                />
                              </div>

                              <div className="d-flex align-items-center justify-content-between mt-3 border border-1 p-2 rounded-4">
                                <h5 className="ms-2 mt-2 text-secondary-03">
                                  數量
                                </h5>
                                <div className="d-flex align-items-center">
                                  <i
                                    type="button"
                                    className="bi bi-dash-circle me-2 icon"
                                    onClick={() => {
                                      handleDecrease(ticketInfo, v.id)
                                    }}
                                  />
                                  <h5 className="px-3 mt-2">{v.qty}</h5>
                                  <i
                                    type="button"
                                    className="bi bi-plus-circle ms-2 icon me-2"
                                    onClick={() => {
                                      handleIncrease(ticketInfo, v.id)
                                    }}
                                  />
                                </div>
                              </div>
                              <br />
                              <div className="modal-footer">
                                {auth.isAuthenticated || !isLoggedIn ? (
                                  <div className="">
                                    <button
                                      className="btn btn-primary-deep text-white"
                                      onClick={() => {
                                        if (!isLoggedIn) {
                                          // 如果用户未登录，显示 Modal
                                          handleShow()
                                        } else {
                                          // 如果用户已登录，将商品加入购物车
                                          addItem(all[0])
                                          MySwal.fire({
                                            icon: 'success',
                                            title: '已成功加入購物車',
                                          })
                                        }
                                      }}
                                    >
                                      加入購物車
                                    </button>
                                    <Modal show={show} onHide={handleClose}>
                                      <Modal.Header
                                        closeButton
                                        className={toastStyle.myToast}
                                      >
                                        <Modal.Title className="text-white">
                                          請先登入會員才可使用購物車
                                          <p className="text-white mt-2">
                                            沒有註冊會員?
                                            <Link href="/user/signup">
                                              <span
                                                className={toastStyle.myToast}
                                              >
                                                {' '}
                                                前往註冊
                                              </span>
                                            </Link>
                                          </p>
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Footer
                                        className={`${toastStyle.myToast} border-0`}
                                      >
                                        <Link href="/user/signin">
                                          <Button variant="primary">
                                            已有會員登入
                                          </Button>
                                        </Link>
                                      </Modal.Footer>
                                    </Modal>
                                  </div>
                                ) : null}

                                <button
                                  type="button"
                                  className="btn btn-primary text-white"
                                  data-bs-dismiss="modal"
                                >
                                  取消
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </main>
        ))}
      </>

      <style global jsx>
        {`
          body {
            background-color: #151515;
            color: #fff;
          }

          .object-fit-cover {
            width: 100%;
            height: 550px;
            object-fit: cover;
            border-radius: 10px;
          }

          .wrapper {
            max-width: 80%;
            margin: 50px auto;
          }

          .store {
            color: white;
            border-radius: 5px;
            border: none;
            padding: 5px 7px;
          }

          .seat1 {
            color: white;
            background: var(--bg-gray-secondary-color);
            padding: 15px;
            border-radius: 10px;
          }

          .btn-warning {
            background-color: GoldenRod;
          }

          .dollar {
            margin-left: 430px;
          }
          .icon {
            font-size: 30px;
          }
          .cart {
            margin-left: 300px;
          }
          .left {
            img {
              max-width: 100%;
            }
          }
          .right {
            position: sticky;
            top: 100px;
             {
              /* margin: 40px auto; */
            }
            height: 320px;
          }
          .choice-date {
            padding: 12px;
            .add-category {
              flex: 1;
              button {
                height: 50px;
              }
            }
          }
          .custom-card {
            border: none;
            background-color: #151515;
            border-radius: 5px;
            overflow: hidden;
          }

          @media screen and (max-width: 576px) {
            .wrapper {
              max-width: 90%;
            }

            main > .container {
              padding: 0;
            }

            .object-fit-cover {
              height: 300px;
            }

            .nav-btn {
              width: 48px;
              height: 48px;
              border-radius: 10px;
              .icon {
                font-size: 32px;
                font-weight: bold;
              }
            }

            .title {
              h3: 26px;
              h5: 14px;
              h6: 14px;
              .mx-4 {
                margin-left: 0 !important;
                margin-bottom: 20px;
              }
            }
            .seat1 {
              margin: 0;
            }
            .btn-toolbar {
              display: none;
            }
          }
        `}
      </style>
    </>
  )
}
