import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'react-bootstrap/Image'

export default function NoCart() {
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=""
      >
        <div className="border-0 cart-card d-flex justify-content-center align-items-center">
          <div className="my-5 text-center d-flex flex-column align-items-center">
            <div className="cart-logo mb-3">
              <Image
                src="\govent-logo.png"
                className="object-fit-cover img-fluid"
                alt="..."
              />
            </div>
            <h5 className="text-white mb-4">您的購物車還是空的</h5>
            <button className="btn btn-primary-deep d-flex d-none d-sm-block">
              <Link href="/product/list" className="text-white">
                瀏覽最新活動!
              </Link>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
