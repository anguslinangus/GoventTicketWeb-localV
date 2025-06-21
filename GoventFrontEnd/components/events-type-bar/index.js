import React, { useState } from 'react'
import CustomEventCard from './event-card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Link from 'next/link'
// import { useHistory } from 'react-router-dom'

export default function EventsTypeBar() {
  // const history = useHistory()
  // const handleCategoryClick = () => {
  //   // 更新 selectedCategories 状态
  //   setSelectedCategories({ concert: true })
  //   // history.push('/product/list')
  // }
  const router = useRouter()
  const handleClick = (category) => {
    router.push(`/product/list/?category=${category}`)
  }
  return (
    <>
      <div className="d-flex justify-content-center py-5 mb-5">
        <div className="width-1200">
          <h4 className="mb-5 text-center">活動分類</h4>

          <div className="d-flex justify-content-between">
            <CustomEventCard
              backgroundImage="/images/events-type/concert.jpg"
              title="演唱會"
              secondTitle="Concert"
              delay="0.1"
              onClick={() => handleClick('演唱會')}
              router={router}
              handleClick={handleClick}
              category="演唱會"
            />
            <CustomEventCard
              backgroundImage="/images/events-type/exhibition.jpg"
              title="展覽"
              secondTitle="Exhibition"
              delay="0.2"
              onClick={() => handleClick('展覽')}
              router={router}
              handleClick={handleClick}
              category="展覽"
            />
            <CustomEventCard
              backgroundImage="/images/events-type/popup.jpg"
              title="快閃活動"
              secondTitle="Pop up"
              delay="0.3"
              onClick={() => handleClick('快閃活動')}
              router={router}
              handleClick={handleClick}
              category="快閃活動"
            />
            <CustomEventCard
              backgroundImage="/images/events-type/marketplace.jpg"
              title="市集"
              secondTitle="Marketplace"
              delay="0.4"
              onClick={() => handleClick('市集')}
              router={router}
              handleClick={handleClick}
              category="市集"
            />
          </div>
          <div className="mt-2 pt-1 d-flex justify-content-between">
            <CustomEventCard
              backgroundImage="/images/events-type/fans.jpg"
              title="粉絲見面會"
              secondTitle="Fans"
              delay="0.5"
              onClick={() => handleClick('粉絲見面會')}
              router={router}
              handleClick={handleClick}
              category="粉絲見面會"
            />
            <CustomEventCard
              backgroundImage="/images/events-type/lecture.jpg"
              title="課程講座"
              secondTitle="Lecture"
              delay="0.6"
              onClick={() => handleClick('課程講座')}
              router={router}
              handleClick={handleClick}
              category="課程講座"
            />
            <CustomEventCard
              backgroundImage="/images/events-type/sports.jpg"
              title="體育賽事"
              secondTitle="Sports"
              delay="0.7"
              onClick={() => handleClick('體育賽事')}
              router={router}
              handleClick={handleClick}
              category="體育賽事"
            />
            <CustomEventCard
              backgroundImage="/images/events-type/sightview.jpg"
              title="景點門票"
              secondTitle="Sight view"
              delay="0.8"
              onClick={() => handleClick('景點門票')}
              router={router}
              handleClick={handleClick}
              category="景點門票"
            />
          </div>
        </div>
      </div>
    </>
  )
}
