import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingLayout from '@/components/layout/loading-layout'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { ScaleLoader } from 'react-spinners'

// 只作導向到 product/list
export default function OrganizerIndex() {
  const router = useRouter()
  const { auth } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [progressNumber, setProgressNumber] = useState(0)

  const [organizerValid, setOrganizerValid] = useState(0)

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
    fetch('http://localhost:3005/api/organizer/', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        // 檢查是否有資料並設定到 state 中
        console.log(data.data.result[0])
        if (data.data.result[0].valid === 1) {
          setOrganizerValid(1)
        } else {
          console.log('no organizer data or in review')
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      if (!auth.user) {
        router.push('/user/signin')
        return
      }
      if(organizerValid === 1){
        router.push('/organizer/event')
        return
      }
      router.push('/organizer/update')
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
            <h3>前往主辦中心</h3>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}>
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

OrganizerIndex.getLayout = function (page) {
  return <LoadingLayout title="進入主辦中心">{page}</LoadingLayout>
}
