import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MemberleftOption({ link, icon, text }) {
  const router = useRouter()
  const isActive = link === router.pathname

  if (isActive) {
    return (
      <motion.h6
        initial={{ borderLeft: "6px solid #f16e0f00", x: -6 }}
        animate={{ borderLeft: "6px solid var(--primary-color)", x: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className={`option-text active`}
      >
        <Link href={`${link}`} className="link">
          <i className={`bi ${icon} text-primary pe-3`}></i>
          <span>{text}</span>
        </Link>
      </motion.h6>
    )
  } else {
    return (
    <h6 className={`option-text`}>
      <Link href={`${link}`} className="link">
        <i className={`bi ${icon} text-primary pe-3`}></i>
        <span>{text}</span>
      </Link>
      <style global jsx>
        {`
          .link {
            color: white;
            text-decoration: none;
          }
          .option-text {
            padding: 0 20px;
            margin-bottom: 20px;
            
            transition: 300ms;
          }
          .option-text.active {
            padding: 0 20px;
            margin-bottom: 20px;
            
            transition: 300ms;
          }
        `}
      </style>
    </h6>
  )}
}
