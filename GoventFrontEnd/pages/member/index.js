import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingLayout from '@/components/layout/loading-layout'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { ScaleLoader } from 'react-spinners'

// 只作導向到 product/list
export default function MemberIndex() {
  const router = useRouter()
  const { auth } = useAuth()

  //Angus 加入的
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('沒有token')
        return
      }

      fetch('http://localhost:3000/user/signin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure "Bearer" is included
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              console.log('得到 403, 401 錯誤')
            }
            throw new Error('Failed to fetch')
          }
          return response.json()
        })
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [])

  const [isVisible, setIsVisible] = useState(false)
  const [progressNumber, setProgressNumber] = useState(0)

  const incrementNumber = (currentNumber, setNumber, incrementSpeed, max) => {
    if (currentNumber < max) {
      setNumber((prevNumber) => prevNumber + incrementSpeed)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      incrementNumber(progressNumber, setProgressNumber, 1, 100)
    }, 3)

    return () => clearInterval(interval)
  }, [progressNumber])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true) // 3秒后将 isVisible 设置为 true
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // 确认 window(瀏覽器) 开始运作后，3秒后进行路由跳转
    if (isVisible) {
      if (!auth.user) {
        router.push('/user/signin')
        return
      }
      router.push('/member/setting')
    }
  }, [isVisible, router])

  return (
    <div className="loading-bg d-flex justify-content-center align-items-center">
      {!auth.user && (
        <div className="control-bgc text-white p-3 text-center">
          <ScaleLoader
            color="var(--primary-color)"
            size={300}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <h3 className="mb-3">請先登入</h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h5>即將跳轉至登入頁</h5>
          </motion.div>
        </div>
      )}
      {auth.user && (
        <div className="control-bgc text-white p-3 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>前往會員中心</h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <span className="sm-p">{progressNumber}%</span>
            <ProgressBar now={`${progressNumber}`} className="my-3 progress" />
          </motion.div>
        </div>
      )}
      <style global jsx>
        {`
          .loading-bg {
            background-color: var(--bg-gray-color);
            width: 100%;
            height: 100vh;
          }
          .control-bgc {
            width: 800px;
          }
          .progress {
            padding: 5px;
            height: 20px;
            background-color: var(--bg-gray-secondary-color);
            border: 1px solid var(--primary-color);
          }
        `}
      </style>
    </div>
  )
}

MemberIndex.getLayout = function (page) {
  return <LoadingLayout title="進入會員中心">{page}</LoadingLayout>
}
