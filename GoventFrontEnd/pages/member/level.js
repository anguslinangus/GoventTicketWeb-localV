import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import Memberleft from '@/components/member/member-left-bar'
import MemberLayout from '@/components/layout/member-layout'
import { motion } from 'framer-motion'
import LevelType from '@/components/member/member-level-type'

// only redirect to member/login
export default function MemberLevel() {
  const [userCostTotal, setUserCostTotal] = useState(0)

  useEffect(() => {
    fetch('http://localhost:3005/api/member/cost', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        if (
          data &&
          data.data &&
          data.data.result
        ) {
          setUserCostTotal(data.data.result[0].total_sum)
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <>
      <div className="container width-1200">
        <Row data-bs-theme="dark" className="mb-5">
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
              <LevelType total_sum={userCostTotal}/>
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
          li {
            color: var(--normal-gray-light-color);
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
            padding: 20px 20px;
          }
        `}
      </style>
    </>
  )
}

MemberLevel.getLayout = function (page) {
  return <MemberLayout title='會員等級'>{page}</MemberLayout>
}
