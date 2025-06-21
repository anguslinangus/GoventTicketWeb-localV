import React, { useState, useEffect } from 'react'
import styles from './member.module.scss'
import Badge from 'react-bootstrap/Badge'
import MemberleftOption from './member-left-option'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { motion } from 'framer-motion'
import { Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'

export default function Memberleft() {
  const router = useRouter()
  const { auth } = useAuth()
  const [userData, setUserData] = useState([])
  const [userCostTotal, setUserCostTotal] = useState(0)
  const [avatar, setAvatar] = useState(null)

  const getUser = () => {
    fetch('http://localhost:3005/api/member', {
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
          data.data.posts &&
          data.data.posts.length > 0
        ) {
          setUserData(data.data.posts[0])
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }

  useEffect(() => {
    if (!auth.user) {
      router.push('/member')
      return
    }
    getUser()
  }, [])

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
        if (data && data.data && data.data.result) {
          setUserCostTotal(data.data.result[0].total_sum)
        } else {
          console.warn('No data received from the server.')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const handleAvatarChange = (event) => {
    const selectedAvatar = event.target.files[0]
    setAvatar(selectedAvatar)
    uploadAvatar(selectedAvatar)
  }

  const uploadAvatar = (avatar) => {
    // 这里可以执行文件上传操作，例如使用fetch发送POST请求将文件上传到服务器
    const formData = new FormData()
    formData.append('avatar', avatar)

    fetch('http://localhost:3005/api/member/avatar', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Avatar uploaded successfully:', data)
        successSwal()
      })
      .catch((error) => {
        console.error('Error uploading avatar:', error)
      })
  }

  const successSwal = () => {
    withReactContent(Swal).fire({
      icon: 'success',
      title: '修改大頭貼成功',
    }).then(() => {
      // 在點擊“確定”後重新加載頁面
      window.location.reload();
    });
  }

  return (
    <div className="member-bgc">
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="py-2"
      >
        <div className="py-3 d-flex justify-content-center">
          <img
            className={`${styles['avatar']} rounded-circle`}
            src={`http://localhost:3005/avatar/${userData.avatar}`}
          />
          <Form.Group>
            <Form.Label htmlFor="avatarInput">
              <div className="upload">
                <div className="btn rounded-circle btn-upload d-flex justify-content-center align-items-center">
                  <i className="bi bi-camera-fill"></i>
                </div>
              </div>
            </Form.Label>
            <Form.Control
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </Form.Group>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <h6 className="mb-0 me-2">
            {userData.name || <Skeleton baseColor="#00000000" />}
          </h6>
          {userCostTotal <= 10000 && (
            <Badge bg="normal-gray-light" className="text-dark">
            <i className="bi bi-diamond-fill me-1 text-gray"></i>銀級會員
            </Badge>
          )}
          {10000 < userCostTotal && userCostTotal <= 20000 && (
            <Badge bg="secondary-01" className="text-dark">
            <i className="bi bi-diamond-fill me-1 text-golden"></i>黃金會員
            </Badge>
          )}
          {20000 < userCostTotal && (
            <Badge bg="info" className="text-dark">
            <i className="bi bi-diamond-fill me-1 text-diamond"></i>鑽石會員
            </Badge>
          )}
        </div>
        <p className={`text-center sm-p ${styles['sm-p']} mt-2`}>
          {userData.username || <Skeleton baseColor="#00000000" />}
        </p>
      </motion.div>
      <hr />
      <div className={`py-2 member-side-bar`}>
        <div className={`${styles['sm-p']} sm-p ps-4 pb-3`}>會員資料</div>
        <MemberleftOption
          link="/member/setting"
          icon="bi-person"
          text="帳戶設定"
        />
        <MemberleftOption
          link="/member/level"
          icon="bi-person-fill-up"
          text="會員等級"
        />
      </div>
      <div className={`py-2 member-side-bar`}>
        <div className={`${styles['sm-p']} sm-p ps-4 pb-3`}>網站相關</div>
        <MemberleftOption
          link="/member/order"
          icon="bi-calendar-minus"
          text="訂單管理"
        />
        <MemberleftOption
          link="/member/coupon"
          icon="bi-ticket-perforated"
          text="優惠卷管理"
        />
        <MemberleftOption
          link="/member/favorites"
          icon="bi-heart"
          text="我的收藏"
        />
      </div>
      <style golbal jsx>
        {`
          .member-side-bar {
            overflow: hidden;
          }
          .upload {
            position: relative;
          }
          .btn-upload {
            width: 35px;
            height: 35px;
            background-color: var(--bg-gray-secondary-color);
            padding-bottom: 12px;
            position: absolute;
            right: -5px;
            top: 60px;
          }
        `}
      </style>
    </div>
  )
}
