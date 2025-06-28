import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Memberleft from '@/components/member/member-left-bar'
import MemberLayout from '@/components/layout/member-layout'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function MemberFavorites() {
  const [userData, setUserData] = useState([])

  const successSwal = () => {
    withReactContent(Swal).fire({
      icon: 'success',
      title: '刪除成功',
    })
    getFavorite()
  }

  const getFavorite = () => {
    fetch('http://localhost:3005/api/member/favorites', {
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
          setUserData(data.data.result)
        } else {
          console.warn('No favorites data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }

  useEffect(() => {
    getFavorite()
  }, [])

  const delectFavorite = async (eventId) => {
    console.log(eventId)
    try {
      const response = await fetch(
        `http://localhost:3005/api/member/delete/${eventId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )
      successSwal()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const onClickDelete = (eventId) => {
    console.log(eventId)
    delectFavorite(eventId);
  }

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
              <h4>我的收藏</h4>
              <hr className="my-4" />
              <div className="mb-4">您已收藏 {userData.length} 項商品</div>
              {userData.map((data, index) => (
                <div key={index} className="event p-3 mt-2 d-flex">
                  <div className="event-img me-4">
                    <Link href={`/product/${data.pid}`}>
                      <img
                        src={`/images/banner/${data.banner}`}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="py-1 content d-flex flex-column justify-content-between">
                    <Link href={`/product/${data.pid}`}>
                      <h5 className="text-white">{data.event_name}</h5>
                    </Link>
                    <div>
                      
                      <span className="sm-p">
                        {data.start_date.split('T')[0]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div
                      className="p-1 d-flex align-items-center delete-favorite text-primary"
                      onKeyDown={() => { }}
                      tabIndex={0}
                      role="button"
                      onClick={() => {
                        onClickDelete(data.pid)
                      }}
                    >
                      <i
                        className="icon bi bi-heart-fill text-primary me-2"
                      ></i>
                      <p className='text'>刪除收藏</p>
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
          .event {
            background-color: var(--bg-gray-light-color);
            border-radius: 10px;
            .content {
              flex: 1;
            }
          }
          .event-img {
            width: 160px;
            height: 100px;
            border-radius: 5px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .delete-favorite{
            overflow: hidden;
            .icon{
              position: relative;
              left: 68px;
              transition: 300ms;
            }
            .text{
              position: relative;
              left: 68px;
              transition: 300ms;
            }
          }
          .delete-favorite:hover{
            .icon{
              left: 0px;
            }
            .text{
              left: 0px;
            }
          }
        `}
      </style>
    </>
  )
}

MemberFavorites.getLayout = function (page) {
  return <MemberLayout title="我的收藏">{page}</MemberLayout>
}
