// import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import MemberLayout from '@/components/layout/member-layout'
import Memberleft from '@/components/member/member-left-bar'
import { motion } from 'framer-motion'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

export default function MemberCoupon() {
  const [coupon, setCoupon] = useState([])
  const [addCoupon, setAddCoupon] = useState('')

  const successSwal = () => {
    withReactContent(Swal).fire({
      icon: 'success',
      title: '新增成功',
    })
    loadData()
  }

  const errorSwal = (title) => {
    withReactContent(Swal).fire({
      icon: 'error',
      title: title,
      text: '請再試一次',
    })
  }

  const loadData = () => {
    fetch('http://localhost:3005/api/member/coupon', {
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
          setCoupon(data.data.result)
        } else {
          console.warn('No favorites data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCoupon = (e) => {
    setAddCoupon(e.target.value)
  }

  const CouponSubmit = async (e) => {
    e.preventDefault()
    // 在這裡處理表單提交的邏輯
    try {
      const response = await fetch(
        'http://localhost:3005/api/member/add-coupon',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coupon: addCoupon }),
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        successSwal()
      } else {
        const errorData = await response.json()
        errorSwal(errorData.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const expiredData = coupon.filter(data => {
    const expiresAtDate = new Date(data.expires_at);
    const currentDate = new Date();
    return expiresAtDate < currentDate && data.valid === 1;
  });

  const availableData = coupon.filter(data => {
    const expiresAtDate = new Date(data.expires_at);
    const currentDate = new Date();
    return expiresAtDate > currentDate && data.valid === 1;
  });

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
              <div className="d-flex justify-content-between">
                <h4>可用優惠卷</h4>
                <Form className="d-flex" onSubmit={CouponSubmit}>
                  <Form.Group className="mb-3 me-3" controlId="formName">
                    <Form.Control
                      className="dark-input"
                      type="text"
                      name="name"
                      placeholder="新增優惠卷"
                      value={addCoupon}
                      onChange={handleCoupon}
                    />
                  </Form.Group>
                  <span>
                    <Button className="" type="submit">
                      新增
                    </Button>
                  </span>
                </Form>
              </div>
              <Tabs defaultActiveKey="available" className="mb-4 mt-2">
                <Tab eventKey="available" title="可使用">
                  <Row className="g-3">
                    {availableData.map((data) => (
                        <Col key={data.id} sm={6}>
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="card"
                          >
                            <div className="sm-p px-3 py-2 d-flex justify-content-between">
                              <div>{data.coupon_name}</div>
                              <div>{data.coupon_code}</div>
                            </div>
                            <hr className="my-0" />
                            <div className="px-3 py-3">
                              <h3 className="text-primary">
                                NT${data.discount_valid}
                              </h3>
                              <p className="pb-3">
                                最低消費金額$ {data.price_min}
                              </p>
                              <p className="sm-p">{data.coupon_description}</p>
                            </div>
                            <hr className="my-0" />
                            <p className="px-3 py-2">
                              使用期限：{data.start_at.split('T')[0]} -{' '}
                              {data.expires_at.split('T')[0]}
                            </p>
                          </motion.div>
                        </Col>
                      ))}
                  </Row>
                </Tab>
                <Tab eventKey="uesd" title="已使用">
                  <Row className='g-3'>
                  {coupon
                    .filter(
                      (data) =>
                        data.valid === 0
                    )
                    .map((data) => (
                      <Col key={data.id} sm={6}>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="card unavailable"
                        >
                          <div className="sm-p px-3 py-2 d-flex justify-content-between">
                            <div>{data.coupon_name}</div>
                            <div>{data.coupon_code}</div>
                          </div>
                          <hr className="my-0" />
                          <div className="px-3 py-3">
                            <h3>NT${data.discount_valid}</h3>
                            <p className="pb-3">
                              最低消費金額$ {data.price_min}
                            </p>
                            <p className="sm-p">{data.coupon_description}</p>
                          </div>
                          <hr className="my-0" />
                          <p className="px-3 py-2">
                            使用期限：{data.start_at.split('T')[0]} -{' '}
                            {data.expires_at.split('T')[0]}
                          </p>
                        </motion.div>
                      </Col>
                    ))}
                    </Row>
                </Tab>
                <Tab eventKey="expired" title="已過期">
                <Row className='g-3'>
                  {expiredData.map((data) => (
                      <Col key={data.id} sm={6}>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="card unavailable"
                        >
                          <div className="sm-p px-3 py-2 d-flex justify-content-between">
                            <div>{data.coupon_name}</div>
                            <div>{data.coupon_code}</div>
                          </div>
                          <hr className="my-0" />
                          <div className="px-3 py-3">
                            <h3>NT${data.discount_valid}</h3>
                            <p className="pb-3">
                              最低消費金額$ {data.price_min}
                            </p>
                            <p className="sm-p">{data.coupon_description}</p>
                          </div>
                          <hr className="my-0" />
                          <p className="px-3 py-2">
                            使用期限：{data.start_at.split('T')[0]} -{' '}
                            {data.expires_at.split('T')[0]}
                          </p>
                        </motion.div>
                      </Col>
                    ))}
                    </Row>
                </Tab>
              </Tabs>
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
          .unavailable {
            opacity: 0.5 !important;
          }
          body.swal2-height-auto {
            height: 100vh !important;
          }
          .nav-tabs,
          .nav-link,
          .nav-tabs:active {
            border-color: #00000000 !important;
            border-radius: 5px;
          }
          .nav-link.active {
            background-color: var(--primary-color) !important;
            border-radius: 5px;
            color: black !important;
          }
        `}
      </style>
    </>
  )
}

MemberCoupon.getLayout = function (page) {
  return <MemberLayout title="優惠卷管理">{page}</MemberLayout>
}
