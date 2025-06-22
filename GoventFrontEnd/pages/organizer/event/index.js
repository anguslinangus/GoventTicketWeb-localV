import React, { use, useEffect, useState } from 'react'
import {
  Row,
  Col,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Badge,
} from 'react-bootstrap'
import Link from 'next/link'
import { motion } from 'framer-motion'

import OrganizerLayout from '@/components/layout/organizer-layout'
import OrganizerSidebar from '@/components/organizer/organizer-sidebar'
import OrganizerTopBar from '@/components/organizer/organizer-top-bar'

export default function OrganizerEvent() {
  const [availableEventList, setAvailableEventList] = useState([])
  const [underRiviewEvents, setUnderRiviewEvents] = useState([])
  const [expiredEvents, setExpiredEvents] = useState([])

  const [searchKeyword, setSearchKeyword] = useState('')

  const [currentPageA, setCurrentPageA] = useState(0)
  const [currentPageU, setCurrentPageU] = useState(0)
  const [currentPageE, setCurrentPageE] = useState(0)

  const date = { timeZone: 'Asia/Taipei', year:'numeric' , month: '2-digit', day: '2-digit' }
  const time = { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' }

  useEffect(() => {
    fetch('http://localhost:3005/api/organizer/event', {
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
          if (searchKeyword !== '') {
            const events = data.data.result
            const availableEvents = events
              .filter((event) => {
                return (
                  event.valid === 1 &&
                  new Date(event.end_date) > new Date() &&
                  event.event_name
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
              })
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 4)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])
            const underRiviewEvents = events
              .filter((event) => {
                return (
                  event.valid === 0 &&
                  new Date(event.end_date) > new Date() &&
                  event.event_name
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
              })
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 4)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])
            const expiredEvents = events
              .filter((event) => {
                return (
                  new Date(event.end_date) < new Date() &&
                  event.event_name
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
              })
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 4)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])

            setAvailableEventList(availableEvents)
            setUnderRiviewEvents(underRiviewEvents)
            setExpiredEvents(expiredEvents)
          } else {
            const events = data.data.result
            const availableEvents = events
              .filter(
                (event) =>
                  event.valid === 1 && new Date(event.end_date) > new Date()
              )
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 4)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])
            const underRiviewEvents = events
              .filter(
                (event) =>
                  event.valid === 0 && new Date(event.end_date) > new Date()
              )
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 4)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])
            const expiredEvents = events
              .filter((event) => new Date(event.end_date) < new Date())
              .reduce((acc, curr, index) => {
                const groupIndex = Math.floor(index / 4)
                if (!acc[groupIndex]) {
                  acc[groupIndex] = []
                }
                acc[groupIndex].push(curr)
                return acc
              }, [])

            setAvailableEventList(availableEvents)
            setUnderRiviewEvents(underRiviewEvents)
            setExpiredEvents(expiredEvents)
          }
        } else {
          console.warn('No favorites data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [searchKeyword])

  // 處理搜尋
  const handleSearchKeywordChange = (event) => {
    setSearchKeyword(event.target.value)
  }

  return (
    <>
      <div className="d-flex organizer-container">
        <OrganizerSidebar />
        <div className="w-100 bg-bg-gray organizer-main d-flex flex-column">
          <OrganizerTopBar title="活動清單" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="event-nav flex-grow-1 d-flex flex-column"
          >
            <div className="d-flex justify-content-between align-items-center px-4 text-normal-gray-light mb-4">
              <div className="d-flex align-items-center"></div>
              <div className="d-flex align-items-center">
                <i className="bi bi-search pe-3"></i>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearchKeywordChange}
                  className="form-control on-search me-2"
                  placeholder="搜尋"
                />
              </div>
            </div>
            <Tabs
              id="uncontrolled-tab-example"
              className="border-0"
              defaultActiveKey="onSale"
              fill
            >
              <Tab
                eventKey="onSale"
                title="上架中"
                className="bg-bg-gray-secondary"
              >
                <div className="d-flex flex-column h-100">
                  <div>
                    {availableEventList[currentPageA] &&
                      availableEventList[currentPageA].map(
                        (event, eventIndex) => (
                          <div key={eventIndex}>
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: eventIndex * 0.1,
                              }}
                              key={currentPageA}
                            >
                              <Row className="mx-1 on-list align-items-center gx-5 mt-2">
                                <Col
                                  sm="auto"
                                  className="on-list-img p-0 ms-4 banner"
                                >
                                  <Badge bg="success" className="badge">
                                    上架中
                                  </Badge>
                                  <img
                                    src={`http://localhost:3005/images/banner/${event.banner}`}
                                    alt=""
                                  />
                                </Col>
                                <Col className="d-flex align-items-center border-end border-normal-gray h-75 ">
                                  <h6 className="m-0">{event.event_name}</h6>
                                </Col>
                                <Col
                                  sm="auto"
                                  className="d-flex flex-column justify-content-center align-items-center border-end border-normal-gray h-75 "
                                >
                                  <div>
                                    <div className="sm-p mb-1">活動時間</div>
                                    <div className="d-flex">
                                      <div>
                                        <h6 className="m-0">
                                        {new Date(event.start_date).toLocaleString('zh', date)}
                                        </h6>
                                        <p>
                                        {new Date(event.start_date).toLocaleString('zh', time)}
                                        </p>
                                      </div>
                                      <div className="mx-3">
                                        <h6 className="m-0">－</h6>
                                      </div>
                                      <div>
                                        <h6 className="m-0">
                                        {new Date(event.end_date).toLocaleString('zh', date)}
                                        </h6>
                                        <p>
                                        {new Date(event.end_date).toLocaleString('zh', time)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                                <Col
                                  sm="auto"
                                  className="d-flex flex-column justify-content-center border-end border-normal-gray h-75 "
                                >
                                  <div className="sm-p mb-1">建立時間</div>
                                  <div className="sm-p">
                                    {new Date(event.create_at).toLocaleString('zh', date)}
                                  </div>
                                </Col>
                                <Col sm="auto" className="text-center mx-3">
                                  <Link
                                    href={`event/${event.event_id}`}
                                    className="text-link"
                                  >
                                    <i className="bi bi-three-dots"></i>
                                    <br />
                                    更多
                                  </Link>
                                </Col>
                              </Row>
                            </motion.div>
                          </div>
                        )
                      )}
                  </div>
                  <div className="d-flex justify-content-center pt-2 mt-auto">
                    <ul className="d-flex">
                      {availableEventList.map((page, index) => (
                        <li key={index} className="list-unstyled mx-1">
                          <button
                            className={`btn ${
                              currentPageA === index
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                            }`}
                            onClick={() => setCurrentPageA(index)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="review"
                title="審核中"
                className="bg-bg-gray-secondary"
              >
                <div className="d-flex flex-column h-100">
                  <div>
                    {underRiviewEvents[currentPageU] &&
                      underRiviewEvents[currentPageU].map(
                        (event, eventIndex) => (
                          <div key={eventIndex}>
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: eventIndex * 0.1,
                              }}
                              key={currentPageU}
                            >
                              <Row className="mx-1 on-list align-items-center gx-5 mt-2">
                                <Col
                                  sm="auto"
                                  className="on-list-img p-0 ms-4 banner"
                                >
                                  <Badge bg="primary" className="badge">
                                    審核中
                                  </Badge>
                                  <img
                                    src={`http://localhost:3005/images/banner/${event.banner}`}
                                    alt=""
                                  />
                                </Col>
                                <Col className="d-flex align-items-center border-end border-normal-gray h-75 ">
                                  <h6 className="m-0">
                                    {event.event_name}
                                  </h6>
                                </Col>
                                <Col
                                  sm="auto"
                                  className="d-flex flex-column justify-content-center align-items-center border-end border-normal-gray h-75 "
                                >
                                  <div>
                                    <div className="sm-p mb-1">活動時間</div>
                                    <div className="d-flex">
                                      <div>
                                        <h6 className="m-0">
                                          {new Date(event.start_date).toLocaleString('zh', date)}
                                        </h6>
                                        <p>
                                        {new Date(event.start_date).toLocaleString('zh', time)}
                                        </p>
                                      </div>
                                      <div className="mx-3">
                                        <h6 className="m-0">－</h6>
                                      </div>
                                      <div>
                                      <h6 className="m-0">
                                      {new Date(event.end_date).toLocaleString('zh', date)}
                                        </h6>
                                        <p>
                                        {new Date(event.end_date).toLocaleString('zh', time)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                                <Col
                                  sm="auto"
                                  className="d-flex flex-column justify-content-center border-end border-normal-gray h-75 "
                                >
                                  <div className="sm-p mb-1">建立時間</div>
                                  <div className="sm-p">
                                    {new Date(event.create_at).toLocaleString('zh', date)}
                                  </div>
                                </Col>
                                <Col sm="auto" className="text-center mx-3">
                                  <Link
                                    href={`event/${event.event_id}`}
                                    className="text-link"
                                  >
                                    <i className="bi bi-three-dots"></i>
                                    <br />
                                    更多
                                  </Link>
                                </Col>
                              </Row>
                            </motion.div>
                          </div>
                        )
                      )}
                  </div>
                  <div className="d-flex justify-content-center pt-2 mt-auto">
                    <ul className="d-flex">
                      {underRiviewEvents.map((page, index) => (
                        <li key={index} className="list-unstyled mx-1">
                          <button
                            className={`btn ${
                              currentPageU === index
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                            }`}
                            onClick={() => setCurrentPageU(index)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="end"
                title="已結束"
                className="bg-bg-gray-secondary"
              >
                <div className="d-flex flex-column h-100">
                  <div>
                    {expiredEvents[currentPageE] &&
                      expiredEvents[currentPageE].map((event, eventIndex) => (
                        <div key={eventIndex}>
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              duration: 0.4,
                              delay: eventIndex * 0.1,
                            }}
                            key={currentPageE}
                          >
                            <Row className="mx-1 on-list align-items-center gx-5 mt-2">
                              <Col
                                sm="auto"
                                className="on-list-img p-0 ms-4 banner"
                              >
                                <Badge bg="danger" className="badge">
                                  已過期
                                </Badge>
                                <img
                                  src={`http://localhost:3005/images/banner/${event.banner}`}
                                  alt=""
                                />
                              </Col>
                              <Col className="d-flex align-items-center border-end border-normal-gray h-75 ">
                                <h6 className="m-0">{event.event_name}</h6>
                              </Col>
                              <Col
                                sm="auto"
                                className="d-flex flex-column justify-content-center align-items-center border-end border-normal-gray h-75 "
                              >
                                <div>
                                  <div className="sm-p mb-1">活動時間</div>
                                  <div className="d-flex">
                                    <div>
                                      <h6 className="m-0">
                                      {new Date(event.start_date).toLocaleString('zh', date)}
                                      </h6>
                                      <p>
                                      {new Date(event.start_date).toLocaleString('zh', time)}
                                      </p>
                                    </div>
                                    <div className="mx-3">
                                      <h6 className="m-0">－</h6>
                                    </div>
                                    <div>
                                      <h6 className="m-0">
                                      {new Date(event.end_date).toLocaleString('zh', date)}
                                      </h6>
                                      <p>
                                      {new Date(event.end_date).toLocaleString('zh', time)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col
                                sm="auto"
                                className="d-flex flex-column justify-content-center border-end border-normal-gray h-75 "
                              >
                                <div className="sm-p mb-1">建立時間</div>
                                <div className="sm-p">
                                {new Date(event.create_at).toLocaleString('zh', date)}
                                </div>
                              </Col>
                              <Col sm="auto" className="text-center mx-3">
                                <Link
                                  href={`event/${event.event_id}`}
                                  className="text-link"
                                >
                                  <i className="bi bi-three-dots"></i>
                                  <br />
                                  更多
                                </Link>
                              </Col>
                            </Row>
                          </motion.div>
                        </div>
                      ))}
                  </div>
                  <div className="d-flex justify-content-center pt-2 mt-auto">
                    <ul className="d-flex">
                      {expiredEvents.map((page, index) => (
                        <li key={index} className="list-unstyled mx-1">
                          <button
                            className={`btn ${
                              currentPageE === index
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                            }`}
                            onClick={() => setCurrentPageE(index)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </motion.div>
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
            height: 100vh;
          }
          .event-nav {
            height: 100%;
            .nav-item {
              background-color: var(--bg-gray-light-color);
              margin-right: 5px;
              border-radius: 5px 5px 0 0;
              .nav-link {
                color: white;
                border: 0px;
                border-top: 4px solid var(--none);
              }
              .nav-link:focus,
              .nav-link:hover {
                 {
                  /* border-color: var(--none); */
                }
                border: 0px;
                border-top: 4px solid var(--primary-color);
              }
              .nav-link.active {
                background-color: var(--bg-gray-secondary-color);
                border: 0px;
                border-top: 4px solid var(--primary-color);
                color: var(--primary-color);
              }
            }
          }
          .tab-content {
            flex: 1;
            .tab-pane {
              height: 100%;
              border-radius: 0 10px 10px 10px;
              padding: 10px 15px;
            }
          }
          .on-search {
            width: 250px;
            height: 30px;
          }
          .on-list {
            border: 1px solid var(--normal-gray-color);
            border-radius: 5px;
            height: 130px;
            .on-list-img {
              border-radius: 5px;
              width: 160px;
              height: 100px;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 5px;
              }
            }
          }
          .banner {
            position: relative;
            .badge {
              position: absolute;
              top: 12px;
              left: -8px;
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
