// import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Row, Col, Image, Button, Container } from 'react-bootstrap'
import TicketInfoLeft from '@/components/member/m-order-left-bar'
import MemberLayout from '@/components/layout/member-layout'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
// oid

export default function MemberOrderInfo() {
  const [tabs, setTabs] = useState(1)
  const [order, setOrder] = useState([])
  const [events, setEvents] = useState([])
  const [tickets, setTickets] = useState([])

  const router = useRouter()
  const { oid } = router.query
  const [oidLoaded, setOidLoaded] = useState(false)
  const [eventInfo, setEventInfo] = useState([])
  const [eventInfoId, setEventInfoId] = useState(0)

  const [checkUser, setCheckUser] = useState(true)
  const [checkOrderNumber, setCheckOrderNumber] = useState(true)

  const dateTime = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }

  const HtmlRenderer = ({ htmlContent }) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  }

  useEffect(() => {
    if (oid) {
      setOidLoaded(true)

      fetch(`http://localhost:3005/api/member/order/${oid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          // 檢查是否有資料並設定到 state 中
          if (data && data.data && data.data.result) {
            setOrder(data.data.result[0])
            setEvents(JSON.parse(data.data.result[0].order_info))
            setEventInfoId(JSON.parse(data.data.result[0].order_info)[0].eventId)
          } else if (data.message == 403) {
            console.warn('非用戶訂單')
            setCheckUser(false)
          } else {
            console.warn('讀取失敗!')
            setCheckOrderNumber(false)
          }
        })
        .catch((error) => {
          setCheckOrderNumber(false)
          console.log('讀取失敗:')
        })
    }
  }, [oid])


  const changeEvent = () => {
    if (eventInfoId !== 0) {
      fetch(`http://localhost:3005/api/member/order/event/${eventInfoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setEventInfo(data.data.result[0])
          }
        })
        .catch((error) => {
          console.error('讀取失敗:', error)
        })
    }
  }

  const ticketInfo = () => {
    fetch(`http://localhost:3005/api/member/order/ticket/${oid}`)
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (data && data.data && data.data.result) {
          const filteredTickets = data.data.result.filter(ticket => ticket.event_id == eventInfoId);
          setTickets(filteredTickets);
        } else {
          console.warn('No order data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }

  useEffect(() => {
    changeEvent()
    ticketInfo()
    console.log(eventInfoId)
  }, [eventInfoId])

  if (!oidLoaded) {
    return <div>Loading...</div>
  } else
    return (
      <>
        {!checkUser && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center warming mt-5"
          >
            <Image
              src="/NothingFoundHere.png"
              alt="Nothing Found Here"
              width="400px"
            />
            <h3 className="mb-4">此非您的訂單</h3>
            <Button>
              <Link href="/member/order" className="text-black">
                返回訂單頁
              </Link>
            </Button>
          </motion.div>
        )}
        {!checkOrderNumber && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center warming mt-5"
          >
            <Image
              src="/NothingFoundHere.png"
              alt="Nothing Found Here"
              width="400px"
            />
            <h3 className="mb-4">訂單不存在</h3>
            <Button>
              <Link href="/member/order" className="text-black">
                返回訂單頁
              </Link>
            </Button>
          </motion.div>
        )}
        {checkUser && checkOrderNumber && (
          <div className="container width-1200">
            <Row data-bs-theme="dark">
              <Col sm={3}>
                <TicketInfoLeft
                  order_id={order.order_id}
                  payment_method={order.payment_method}
                  price={order.total}
                  coupon_discount={order.coupon_discount}
                  points_discount={order.points_discount}
                  points_rebate={order.points_rebate}
                  created_at={order.created_at}
                />
              </Col>
              <Col sm={9}>
                <Row className="g-3">
                  {events.map((data, index) => (
                    <Col key={index} sm="6" className="">
                      <div>
                        <button
                          type="button"
                          className={`btn member-bgc ${data.eventId === eventInfoId ? 'active' : ''} event-btn px-4 py-3 w-100`}
                          onClick={() => {
                            setEventInfoId(data.eventId)
                          }}
                        >
                          {data.eventName}
                        </button>
                      </div>
                    </Col>
                  ))}
                </Row>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  key={eventInfoId}
                  className="member-bgc mt-3"
                >
                  <div className="px-2 bottom-line d-flex">
                    <div
                      role="button"
                      tabIndex={0}
                      className={`p-3 ${tabs === 1 ? 'text-primary' : ''}`}
                      onClick={() => {
                        setTabs(1)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setTabs(1)
                        }
                      }}
                    >
                      <h6 className="m-0">活動資訊</h6>
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={`p-3 ${tabs === 2 ? 'text-primary' : ''}`}
                      onClick={() => {
                        setTabs(2)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setTabs(2)
                        }
                      }}
                    >
                      <h6 className="m-0">活動說明</h6>
                    </div>
                    <div
                      role="button"
                      tabIndex={0}
                      className={`p-3 ${tabs === 3 ? 'text-primary' : ''}`}
                      onClick={() => {
                        setTabs(3)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setTabs(3)
                        }
                      }}
                    >
                      <h6 className="m-0">票卷資訊</h6>
                    </div>
                  </div>
                  <div className="p-4">
                    {tabs === 1 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="order-content d-flex"
                      >
                        <Image src={`http://localhost:3005/images/banner/${eventInfo.banner}`} width={300} />
                        <div className='ms-4'>
                          <h4 className='mb-3'>{eventInfo.event_name}</h4>
                          <div className="d-flex align-items-center mb-2">
                            <p className="me-3 tabs sm-p">活動時間</p>
                            <div>
                              {eventInfo.start_date && (
                                <h6 className="m-0">{new Date(eventInfo.start_date).toLocaleString('zh', dateTime)}
                                {' － '}
                                {new Date(eventInfo.end_date).toLocaleString('zh', dateTime)}</h6>
                              )}
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <p className="me-3 tabs sm-p">活動地點</p>
                            <div>
                              <h6 className="m-0">{eventInfo.place}</h6>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <p className="me-3 tabs sm-p">活動地址</p>
                            <div>
                              <h6 className="m-0">{eventInfo.address}</h6>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {tabs === 2 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="order-content"
                      >
                        <HtmlRenderer htmlContent={eventInfo.content} />
                      </motion.div>
                    )}
                    {tabs === 3 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        {tickets.map((ticket) => (
                          <div key={ticket.id} className="event mb-3">
                            <div className="sm-p px-3 py-2">
                              票卷編號 {ticket.ticket_code}
                            </div>
                            <hr className="my-0" />
                            <div className="p-3 d-flex">
                              <div className="me-4">
                                <QRCodeSVG
                                  value={ticket.ticket_code}
                                  bgColor="#00000000"
                                  fgColor="#ffffff"
                                />
                              </div>
                              <div className="d-flex flex-column justify-content-between">
                                <div>
                                  <p>{eventInfo.event_name}</p>
                                  <h4 className="text-primary-light">
                                    {ticket.option_name}
                                  </h4>
                                </div>
                                <div className="d-flex flex-column justify-content-between">
                                  <div className="text-normal-gray-light">
                                    <p className="pb-1">
                                      {new Date(ticket.holding_time).toLocaleString('zh', dateTime)}
                                    </p>
                                    <p>
                                      {eventInfo.place}｜{eventInfo.address}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        )}
        <style global jsx>
          {`
            body {
              background-color: #1e1e1e;
              color: #fff;
              padding: 90px 0 0 0;
            }
            .dark-input {
              background-color: #232323;
              color: #fff;
              border: 1px solid #404040;
            }
            .member-bgc {
              background-color: #282828;
              border-radius: 10px;
            }
            .contain {
              padding: 30px 40px;
            }
            .card {
              background-color: var(--bg-gray-light-color);
              border-radius: 10px;
            }
            .ticket-number {
              border-bottom: 1px solid var(--normal-gray-color);
              padding: 10px 20px;
            }
            .event {
              border: 1px solid var(--normal-gray-color);
              border-radius: 10px;
              .flex-1 {
                flex: 1;
              }
            }
            .event-img {
              width: 150px;
              height: 100%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            .order-content {
              img {
                max-width: 100%;
                border-radius: 10px;
                object-fit: cover;
              }
            }
            .event-btn {
              border: none;
              &:hover {
                background-color: var(--primary-color);
              }
            }
            .event-btn.active{
              background-color: var(--primary-color);
            }
            .tabs {
              background-color: var(--bg-gray-color);
              padding: 7px 10px;
              border-radius: 5px;
              color: var(--normal-gray-light-color);
            }
          `}
        </style>
      </>
    )
}

MemberOrderInfo.getLayout = function (page) {
  return <MemberLayout>{page}</MemberLayout>
}
