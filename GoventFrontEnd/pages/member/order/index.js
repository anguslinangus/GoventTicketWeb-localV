// import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Memberleft from '@/components/member/member-left-bar'
import Link from 'next/link'
import MemberLayout from '@/components/layout/member-layout'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import { now } from 'lodash'

export default function MemberOrder() {
  const router = useRouter()
  const { auth } = useAuth()
  const [orders, setOrders] = useState([])

  const date = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }
  const time = { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' }

  useEffect(() => {
    if (!auth.user) {
      router.push('/member')
      return
    }
    fetch('http://localhost:3005/api/member/order', {
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
          console.log('Received data:', data.data.result)
          setOrders(data.data.result)
          console.log(orders)
        } else {
          console.warn('No favorites data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [auth.user, router])

  return (
    <>
      <div className="container width-1200">
        <Row data-bs-theme="dark">
          <Col sm={3}>
            <Memberleft />
          </Col>
          <Col sm={9}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="member-bgc contain"
            >
              <h4>我的訂單</h4>
              <hr className="my-4" />
              {orders.map((data, index) => (
                <div key={data.id} className="event mt-2">
                  {data.created_at && (
                    <div className="ticket-number sm-p">
                    訂單建立時間：{new Date(data.created_at).toLocaleString('zh', date)} {new Date(data.created_at).toLocaleString('zh', time)}
                    </div>
                  )}
                  <div className="p-3 d-flex">
                    <div className="event-img me-4 d-flex flex-column">
                      <div className="flex-1 main-img">
                        <img
                          src={`http://localhost:3005/images/banner/${
                            JSON.parse(data.order_info)[0].images
                          }`}
                          alt=""
                          className=""
                        />
                      </div>
                      <div className="d-flex others-imgs">
                        {JSON.parse(data.order_info).map((event, index) => (
                          <>
                            {index > 0 && (
                              <div key={index} className="other-img">
                                <img
                                  src={`http://localhost:3005/images/banner/${event.images}`}
                                  alt=""
                                  className=""
                                />
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    </div>
                    <div className="me-2 content d-flex flex-column justify-content-between">
                      <div>
                        {JSON.parse(data.order_info).map((event, index) => (
                          <h6 key={index}>．{event.eventName}</h6>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <h6 className="text-primary-deep">
                            總金額 ${data.total}
                          </h6>
                          <p className="sm-p">
                            訂單編號 {data.order_id}
                          </p>
                        </div>

                        <Link href={`order/${data.order_id}`}>
                          <button className="btn btn-primary text-white">
                            查看詳情
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </Col>
        </Row>
      </div>
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
            background-color: var(--bg-gray-light-color);
            border-radius: 10px;
            .content {
              flex: 1;
            }
          }
          .flex-1{
            flex: 1;
          }
          .event-img {
            position: relative;
            width: 160px;
            .main-img{
              max-height: 120px;
            }
            img {
              border-radius: 5px;
              width: 100%;
              height: 100%;
              object-fit: cover;
              box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.75);
            }
            .others-imgs {
             img{
              margin-top: 10px;
              height: 50px;
             }
                }

            .other-img {
              flex: 1;
              margin-right: 10px; /* 添加其他圖像之間的間距 */
            }

            .other-img:last-child {
              margin-right: 0; /* 移除最後一個元素的右邊距 */
            }
        `}
      </style>
    </>
  )
}

MemberOrder.getLayout = function (page) {
  return <MemberLayout title="訂單管理">{page}</MemberLayout>
}
