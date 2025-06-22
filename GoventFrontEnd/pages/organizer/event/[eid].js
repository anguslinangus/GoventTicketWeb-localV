import React, { useEffect, useState } from 'react'
import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'
import { Row, Col, Tab, Tabs, Table } from 'react-bootstrap'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function OrganizerEvent() {
  const [page, setPage] = useState(1)
  const [eventInfo, setEventInfo] = useState([])
  const [eventOption, setEventOption] = useState([])
  const [eventTicket, setEventTicket] = useState([])
  const [eventOrderTotal, setEventOrderTotal] = useState(0)
  const [eventOrderQty, setEventOrderQty] = useState(0)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const router = useRouter()
  const { eid } = router.query

  const date = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }
  const time = { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' }

  useEffect(() => {
    fetch(`http://localhost:3005/api/organizer/event/${eid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (data && data.data && data.data.result) {
          setEventInfo(data.data.result[0])
          console.log('資料庫撈出來的時間', eventInfo.start_date)
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))

    fetch(`http://localhost:3005/api/organizer/event/option/${eid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (data && data.data && data.data.result) {
          setEventOption(data.data.result)
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))

    fetch(`http://localhost:3005/api/organizer/event/order/${eid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (data && data.data) {
          setEventOrderTotal(data.data.total)
          setEventOrderQty(data.data.qty)
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))

    fetch(`http://localhost:3005/api/organizer/event/ticket/${eid}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (data && data.data && data.data.result) {
          if (searchKeyword !== '') {
            const tickets = data.data.result
            const searchTickets = tickets
              .filter((ticket) => {
                return ticket.name
                  .toLowerCase()
                  .includes(searchKeyword.toLowerCase())
              })
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 13)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])
            setEventTicket(searchTickets)
          } else {
            const tickets = data.data.result
            const allTickets = tickets.reduce((acc, curr, index) => {
              const groupIndex = Math.floor(index / 13)
              if (!acc[groupIndex]) {
                acc[groupIndex] = []
              }
              acc[groupIndex].push(curr)
              return acc
            }, [])
            setEventTicket(allTickets)
          }
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [eid, searchKeyword])

  // 處理搜尋
  const handleSearchKeywordChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  return (
    <>
      <div className="d-flex organizer-container">
        <div className="organizer-sidebar d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex justify-content-center align-items-center logo-bar">
              <Image
                src="/govent-logo.png"
                alt=""
                width={100}
                height={24}
                priority
              />
              <h6 className="m-0 ps-2">主辦中心</h6>
            </div>
            <div className="ms-4 ps-1 mb-4 mt-2">
              <Link href="/organizer/event" className="text-link">
                <i className="bi bi-arrow-left pe-3 text-primary-light"></i>
                返回列表
              </Link>
            </div>
            <div className="ms-4 ps-1 mb-4">
              <div
                className="text-link"
                onClick={() => {
                  setPage(1)
                }}
                onKeyDown={() => { }}
                role="button"
                tabIndex={0}
              >
                <i className="bi bi-speedometer pe-3 text-primary-light"></i>
                活動資訊總覽
              </div>
            </div>
            <div className="ms-4 ps-1">
              <div
                className="text-link"
                onClick={() => {
                  setPage(2)
                }}
                onKeyDown={() => { }}
                role="button"
                tabIndex={0}
              >
                <i className="bi bi-ticket-detailed-fill pe-3 text-primary-light"></i>
                票卷管理
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center sm-p py-5">
            COPYRIGHT © 2024
            <br />
            GOVENT All rights reserved.
          </div>
        </div>
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="活動資訊總覽" />
          <div className="p-4 flex-1 d-flex flex-column flex-grow-1">
            {page === 1 ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                key={page}
              >
                {eventInfo &&
                  eventInfo.start_date &&
                  eventInfo.end_date &&
                  eventOption ? (
                  <Row className="gx-5">
                    <Col sm="5">
                      <Row className="g-3">
                        <Col sm="12">
                          <div className="object-fit">
                            <img
                              src={`http://localhost:3005/images/banner/${eventInfo.banner}`}
                            />
                          </div>
                        </Col>
                        <Col sm="12">
                          <div>
                            <h3>{eventInfo.event_name}</h3>
                            <div className="sm-p mb-3 pb-1">
                              活動編號：{eventInfo.event_id}
                            </div>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="control-bgc">
                            <div className="d-flex align-items-center">
                              <p className="m-0 right-line px-3 py-2">
                                活動狀態
                              </p>
                              <h6 className="m-0 flex-1 text-center">
                                {eventInfo.valid === 1 &&
                                  new Date(eventInfo.end_date) > new Date()
                                  ? '上架中'
                                  : eventInfo.valid === 0
                                    ? '審核中'
                                    : '已過期'}
                              </h6>
                            </div>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="control-bgc">
                            <div className="d-flex align-items-center">
                              <p className="m-0 right-line px-3 py-2">
                                銷售總數
                              </p>
                              <h6 className="m-0 flex-1 text-center">{eventOrderQty}</h6>
                            </div>
                          </div>
                        </Col>
                        <Col sm="12">
                          <div className="control-bgc">
                            <div className="d-flex align-items-center">
                              <p className="m-0 right-line px-3 py-2">
                                總銷售額
                              </p>
                              <h6 className="m-0 flex-1 text-center">
                                {eventOrderTotal}
                              </h6>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm="7">
                      <Tabs
                        defaultActiveKey="info"
                        id="uncontrolled-tab-example"
                        className="mb-5"
                        justify
                      >
                        <Tab eventKey="info" title="活動資訊">
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                          >
                            <div className="d-flex align-items-center mb-3">
                              <p className="me-3 tabs">活動地點</p>
                              <div>
                                <h6 className="m-0">{eventInfo.place}</h6>
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <p className="me-3 tabs">活動地址</p>
                              <div>
                                <h6 className="m-0">{eventInfo.address}</h6>
                              </div>
                            </div>
                            <hr className="my-4" />
                            <div className="d-flex align-items-center mb-3">
                              <p className="me-3 tabs">活動類別</p>
                              <h6 className="m-0">{eventInfo.activity_name}</h6>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                              <p className="me-3 tabs">活動時間</p>
                              <h6 className="m-0">
                                {new Date(eventInfo.start_date).toLocaleString('zh', date)}{' '}
                                {new Date(eventInfo.start_date).toLocaleString('zh', time)}{' '}
                                － {' '}
                                {new Date(eventInfo.end_date).toLocaleString('zh', date)}{' '}
                                {new Date(eventInfo.end_date).toLocaleString('zh', time)}{' '}
                              </h6>
                            </div>
                            <div className="d-flex align-items-center">
                              <p className="me-3 tabs">售票時間</p>
                              <h6 className="m-0">
                              {new Date(eventInfo.sell_start_date).toLocaleString('zh', date)}{' '}
                                {new Date(eventInfo.sell_start_date).toLocaleString('zh', time)}{' '}
                                － {' '}
                                {new Date(eventInfo.sell_end_date).toLocaleString('zh', date)}{' '}
                                {new Date(eventInfo.sell_end_date).toLocaleString('zh', time)}{' '}
                              </h6>
                            </div>
                          </motion.div>
                        </Tab>
                        <Tab eventKey="profile" title="活動內容">
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="content"
                            dangerouslySetInnerHTML={{
                              __html: eventInfo.content,
                            }}
                          />
                        </Tab>
                        <Tab
                          eventKey="option"
                          title="活動規格"
                          className="content"
                        >
                          {eventOption.map((option, index) => (
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.4 }}
                              key={option.id}
                              className="control-bgc mb-4"
                            >
                              <div className="px-4 py-3 bottom-line">
                                <div className="d-flex justify-content-between">
                                  <h4 className="text-primary">
                                    {option.option_name}
                                  </h4>
                                  <h6>最大數量：{option.max_quantity}</h6>
                                </div>
                                <h6>售價：{option.price}</h6>
                              </div>
                              <div className="px-4 py-3">
                                <p>{option.contain}</p>
                              </div>
                            </motion.div>
                          ))}
                        </Tab>
                      </Tabs>
                    </Col>
                  </Row>
                ) : (
                  <div>Loading...</div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                key={page}
                className="flex-1 d-flex flex-column"
              >
                <div className="d-flex justify-content-between align-items-center text-normal-gray-light mb-4">
                  <div></div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-search pe-3"></i>
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={handleSearchKeywordChange}
                      className="form-control on-search"
                      placeholder="搜尋購票者"
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  key={currentPage}
                >
                  <Table bordered hover variant="dark" className="table-color">
                    <thead>
                      <tr>
                        <th>訂單編號</th>
                        <th>票卷編號</th>
                        <th>訂單建立時間</th>
                        <th>購買者</th>
                        <th>票種</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventTicket[currentPage] &&
                        eventTicket[currentPage].map((ticket) => (
                          <tr key={ticket.id}>
                            <td>{ticket.order_number}</td>
                            <td>{ticket.ticket_code}</td>
                            <td>
                            {new Date(ticket.created_at).toLocaleString('zh', date)}
                            </td>
                            <td>{ticket.name}</td>
                            <td>{ticket.option_name}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </motion.div>
                <div className="d-flex justify-content-center pt-2 mt-auto">
                  <ul className="d-flex">
                    {eventTicket.map((page, index) => (
                      <li key={index} className="list-unstyled mx-1">
                        <button
                          className={`btn ${currentPage === index
                              ? 'btn-primary'
                              : 'btn-outline-primary'
                            }`}
                          onClick={() => setCurrentPage(index)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <style global jsx>
        {`
          body {
            background-color: var(--bg-dark-color);
            color: var(--normal-white-color);
          }
          .sm-p {
            color: var(--normal-gray-light-color);
          }
          .organizer-container {
            width: 100%;
            min-height: 100vh;
          }
          .organizer-main {
            border-radius: 30px 0 0 30px;
            padding: 25px;
            min-height: 100vh;
            height: 100%;
          }
          .control-bgc {
            background-color: var(--bg-gray-secondary-color);
            border-radius: 10px;
          }
          .p-20 {
            padding: 20px;
          }
          .object-fit {
            border-radius: 10px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .tabs {
            background-color: var(--bg-gray-secondary-color);
            padding: 7px 10px;
            border-radius: 5px;
            color: var(--normal-gray-light-color);
          }
          .table-color {
            tr th {
              background-color: var(--primary-color);
              text-align: center;
              border: 1px solid var(--normal-gray-color);
            }
            tr td {
              background-color: var(--bg-gray-secondary-color);
              text-align: center;
              border: 1px solid var(--normal-gray-color);
            }
          }
          .flex-1 {
            flex: 1;
          }
          .nav-tabs,
          .nav-link,
          .nav-tabs:active {
            border-color: #00000000 !important;
            border-radius: 5px;
          }
          .nav-item:not(:last-child) {
            padding-right: 8px;
          }
          .nav-link {
            border: 1px solid var(--primary-color) !important;
          }
          .nav-link.active {
            background-color: var(--primary-color) !important;
            border-radius: 5px;
            color: black !important;
          }
          .content {
            overflow: scroll;
            max-height: 600px;
            img {
              max-width: 100%;
            }
          }
          .organizer-sidebar {
            width: 280px;

            .logo-bar {
              height: 120px;
            }
            .on-nav {
              * {
                border: 0;
                color: white;
              }
              .accordion-body {
                background-color: var(--bg-dark-color);
                li {
                  list-style-type: none;
                  padding-bottom: 12px;
                  a {
                    transition: 0.4s;
                    &:focus,
                    &:active,
                    &:hover {
                      color: var(--primary-light-color);
                    }
                  }
                }
              }
            }
            .accordion-button {
              background-color: var(--bg-dark-color);
              box-shadow: none;
              border: 0;
              &:focus,
              &:active,
              &:hover {
                color: var(--primary-light-color);
              }
            }
          }
        `}
      </style>
    </>
  )
}

OrganizerEvent.getLayout = function (page) {
  return <OrganizerLayout>{page}</OrganizerLayout>
}
