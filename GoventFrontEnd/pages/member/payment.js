import { useEffect, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import Memberleft from '@/components/member/member-left-bar'
import MemberLayout from '@/components/layout/member-layout'
import { motion } from 'framer-motion'


export default function MemberPayment() {

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
              <Form>
                <h4>管理付款方式</h4>
                <Row className="mt-4">
                  <Col sm={4}>
                    <div className="card d-flex justify-content-between p-3">
                      <div className="text-end">
                        刪除<i className="ps-2 bi bi-x-square-fill"></i>
                      </div>
                      <div className="card-content d-flex justify-content-between">
                        <p>XXXX-1234</p>
                        <p>09/25</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
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
            width: 100%;
            height: 160px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(to bottom, #e88741, #f16e0f);
            .card-content {
            }
          }
        `}
      </style>
    </>
  )
}

MemberPayment.getLayout = function (page) {
  return <MemberLayout title="管理付款方式">{page}</MemberLayout>
}
