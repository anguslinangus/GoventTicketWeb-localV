import React from 'react'
import styles from './member.module.scss'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TicketInfoLeft({
  order_id='',
  payment_method='',
  price='',
  coupon_discount='',
  points_discount='',
  points_rebate='',
  created_at='',
}) {
  const dateTime = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="member-bgc sticky"
    >
      <div className="p-3 px-4 bottom-line">
        <Link href="/member/order">
          <h6 className="m-0 text-primary">
            <i className="bi bi-arrow-left pe-2"></i>返回票卷列表
          </h6>
        </Link>
      </div>
      <div className="p-4 bottom-line">
        <div className='mb-3'>
          <div className={`${styles['sm-p']} mb-2 sm-p`}>訂單編號</div>
          <p className="m-0">{order_id}</p>
        </div>
        <div>
          <div className={`${styles['sm-p']} mb-2 sm-p`}>訂單時間</div>
          {created_at && (
            <p className="m-0">{new Date(created_at).toLocaleString('zh', dateTime)}</p>
          )}
        </div>
      </div>
      <div className="p-4 bottom-line">
        <div>
          <div className={`${styles['sm-p']} mb-2 sm-p`}>付款方式</div>
          <p className="m-0">{payment_method}</p>
        </div>
      </div>
      <div className="p-4">
        <div>
          <div className={`${styles['sm-p']} mb-2 sm-p`}>費用明細</div>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <p>優惠卷折扣</p>
            <p className="m-0">-$ {coupon_discount}</p>
          </div>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <p>點數折扣</p>
            <p className="m-0">-$ {points_discount}</p>
          </div>
          <hr/>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <h6 className='m-0'>訂單金額</h6>
            <h6 className="text-primary m-0">NT$ {price}</h6>
          </div>
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <p>GOVENT 點數回饋</p>
            <p className="m-0 text-secondary-01"><i className="bi bi-coin me-1"></i>{points_rebate}</p>
          </div>
        </div>
      </div>
      <style global jsx>
        {`
        .sticky{
          position: sticky;
          top:88px;
        }
        `}
      </style>
    </motion.div>
  )
}
