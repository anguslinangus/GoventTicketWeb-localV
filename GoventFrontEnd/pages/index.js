import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import Carousel from 'react-bootstrap/Carousel'
import EventsBar from '@/components/events-bar'
import EventsTypeBar from '@/components/events-type-bar'
import IndexLayout from '@/components/layout/index-layout'
import { motion, useTime, useTransform } from 'framer-motion'

// 載入svg
import GoventStar from '@/public/images/index-silder/govent-star.svg'
import BG01 from '@/public/images/index-silder/bg-01.svg'
import BG02 from '@/public/images/index-silder/bg-02.svg'

export default function Home() {
  const time = useTime()
  const rotate = useTransform(time, [0, 4000], [0, 20], { clamp: false })

  return (
    <>
      <Carousel fade className="mb-5">
        <Carousel.Item>
          <div className={`${styles['image-container']} w-100`}>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="h-100"
              src="/images/index-silder/img_pc_08.png"
              alt="First slide"
            />
            <div
              className="w-100 h-100 silder-bg"
              style={{ background: `#D5D8DC` }}
            ></div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="govent-star"
            >
              <GoventStar />
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
              style={{ rotate }}
              className="bg-rotate"
            >
              <BG01 className={`bg-01-color`} />
            </motion.div>
          </div>
          <Carousel.Caption
            className={`mb-5 ${styles['carousel-caption']} d-flex flex-column align-items-center`}
          >
            <motion.h5
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`px-4 ${styles['secondary-title-start']}`}
            >
              YOASOBI
            </motion.h5>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h1>YOASOBI 演唱會2024台北站</h1>
            </motion.div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-3"
            >
              <button className="btn btn-primary-deep-50 text-white">
                熱門排行
              </button>
              <button className="btn btn-primary-deep-50 text-white ms-2">
                演唱會
              </button>
            </motion.div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <div className={`${styles['image-container']} w-100`}>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="h-100"
              src="/images/index-silder/ive.png"
              alt="First slide"
            />
            <div
              className="w-100 h-100 silder-bg"
              style={{ background: `#d8bfd8` }}
            ></div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="govent-star"
            >
              <GoventStar />
            </motion.div>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
              style={{ rotate }}
              className="bg-rotate"
            >
              <BG02 className="bg-02-color" />
            </motion.div>
          </div>
          <Carousel.Caption
            className={`mb-5 ${styles['carousel-caption']} d-flex flex-column align-items-center`}
          >
            <motion.h5
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`px-4 ${styles['secondary-title-start']}`}
            >
              IVE
            </motion.h5>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h1>‘SHOW WHAT I HAVE’ IN TAIPEI</h1>
            </motion.div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-3"
            >
              <button className="btn btn-primary-deep-50 text-white">
                熱門排行
              </button>
              <button className="btn btn-primary-deep-50 text-white ms-2">
                演唱會
              </button>
            </motion.div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <EventsBar />
      </motion.div>

      <div>
        <EventsTypeBar />
      </div>

      <style global jsx>
        {`
          body {
            background-color: #151515;
            color: #fff;
          }
          .carousel-item {
            height: 900px;
          }
          .silder-bg {
            position: absolute;
            z-index: -4;
          }
          .bg-rotate {
            position: absolute;
            width: 1500px;
            z-index: -4;
            top: 12%;
            left: 50%;
            margin-left: -750px;
          }
          .govent-star {
            width: 400px;
            position: absolute;
            z-index: -1;
            top: 58%;
            left: 50.5%;
            transform: translate(-50%, -50%);
            img {
              width: 100%;
            }
          }
          .bg-01-color {
            fill: #34495e;
          }
          .bg-02-color {
            fill: #a569bd;
          }
        `}
      </style>
    </>
  )
}

Home.getLayout = function (page) {
  return <IndexLayout title="GOVENT - 你的購票好夥伴">{page}</IndexLayout>
}
