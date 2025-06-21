import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

const CustomEventCard = ({
  backgroundImage,
  title,
  secondTitle,
  delay,
  handleClick,
  category,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  //路由標籤用
  const router = useRouter()
  const handleCardClick = (category) => {
    handleClick(category)
    router.push(`/product/list/?category=${category}`)
  }

  return (
    <motion.div
      className={`custom-events-type d-flex ${isHovered ? 'flex-2' : ''}`}
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      onClick={() => handleCardClick(title)}
    >
      <i
        className={`bi bi-arrow-up-right-circle-fill text-white icon h4 ${
          isHovered ? '' : 'hide'
        }`}
      ></i>
      <Link
        href={`/product/list/?category=${category}`}
        className={`text-white d-flex flex-column p-4 justify-content-end`}
      >
        <motion.h5
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="mb-0"
        >
          {title}
        </motion.h5>
        <p className={`second-title ${isHovered ? '' : 'hide'}`}>
          {secondTitle}
        </p>
      </Link>
      <div className={`bg-linear ${isHovered ? 'active' : ''}`}></div>
      <style global jsx>
        {`
          .custom-events-type {
            position: relative;
            transition: 300ms;
            flex: 1;
            margin-inline: 7px;
            height: 200px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            border-radius: 10px;
            h5 {
              transition: 300ms;
              transform: translateY(20px);
              text-shadow: 2px 2px 4px #333;
            }
            a {
              width: 100%;
              z-index: 1;
            }
            .icon {
              position: absolute;
              right: 20px;
              top: 15px;
              opacity: 1;
              transition: 300ms;
            }
            .icon.hide {
              opacity: 0;
            }
          }
          .custom-events-type.flex-2 {
            flex: 2;
            h5 {
              transform: translateY(0px);
            }
          }
          .second-title {
            transition: 300ms;
            opacity: 1;
          }
          .second-title.hide {
            opacity: 0;
          }
          .bg-linear {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              180deg,
              rgba(21, 21, 21, 0) 40%,
              rgba(21, 21, 21, 50)
            );
            opacity: 0.7;
            transition: 400ms;
            z-index: 0;
          }
          .bg-linear.active {
            opacity: 1;
          }
        `}
      </style>
    </motion.div>
  )
}

export default CustomEventCard
