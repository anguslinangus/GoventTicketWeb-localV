import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProgressBar from 'react-bootstrap/ProgressBar'

export default function LevelType({ total_sum = '' }) {
  const [progressNumber, setProgressNumber] = useState(0)
  const [maxProgressNumber, setMaxProgressNumber] = useState(0)
  const [memberLevel, setMemberLevel] = useState('')
  const [nextMemberLevel, setNextMemberLevel] = useState('')
  const [nextLevel, setNextLevel] = useState(0)
  const incrementSpeed = 2

  useEffect(() => {
    if (total_sum !== 0) {
      // 修改此处条件判断
      let newMaxProgressNumber
      let newMemberLevel
      let newNextMemberLevel
      let newNextLevel
      if (total_sum < 10000) {
        newMaxProgressNumber = total_sum / 100
        newMemberLevel = '銀級會員'
        newNextMemberLevel = '黃金會員'
        newNextLevel = 10000
      } else if (total_sum >= 10000 && total_sum < 20000) {
        newMaxProgressNumber = total_sum / 200
        newMemberLevel = '黃金會員'
        newNextMemberLevel = '鑽石會員'
        newNextLevel = 20000
      } else if (total_sum >= 20000) {
        newMaxProgressNumber = 100
        newMemberLevel = '鑽石會員'
      }
      setMaxProgressNumber(newMaxProgressNumber)
      setMemberLevel(newMemberLevel)
      setNextMemberLevel(newNextMemberLevel)
      setNextLevel(newNextLevel)
    }
  }, [total_sum])

  useEffect(() => {
    const interval = setInterval(() => {
      // 使用函数式更新确保使用最新的 maxProgressNumber
      setProgressNumber((prevProgressNumber) => {
        if (prevProgressNumber >= maxProgressNumber) {
          clearInterval(interval)
          return prevProgressNumber
        }
        return prevProgressNumber + incrementSpeed
      })
    }, 10)

    return () => clearInterval(interval)
  }, [maxProgressNumber]) // 在依赖数组中添加 maxProgressNumber

  return (
    <>
      <div className="member-bgc contain bg-bg-gray">
        <div className="d-flex justify-content-between pb-2">
          <span className="sm-p">會員等級</span>
          <span className="sm-p">
            <i className="bi bi-question-circle"></i> 常見問題與幫助
          </span>
        </div>
        <h4>{memberLevel}</h4>
        <hr className="my-4" />
        <h6 className="text-normal-gray-light">會籍禮遇</h6>
        {memberLevel == '鑽石會員' && (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-3"
            >
              <h5>
                <i className="bi bi-credit-card pe-2 text-primary"></i>
                消費金額 10% 點數回饋
              </h5>
              <ul>
                <li>
                  <p>
                    積分累積加速：作為黃金會員，您在購物、參與活動等方面可以更快速地累積積分
                  </p>
                </li>
                <li>
                  <p>
                    獨家禮品或折扣券：您可以使用積分兌換獨家禮品或折扣券，讓您感受到不斷的價值回饋。
                  </p>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-3"
            >
              <h5>
                <i className="bi bi-cake pe-2 text-primary"></i>生日特典
              </h5>
              <ul>
                <li>
                  <p>
                    生日禮物：在您的生日當月，您可獲得獨家的生日禮物或優惠券，提升您的會員體驗。
                  </p>
                </li>
                <li>
                  <p>
                    生日活動參與權：參與獨家的生日活動，例如舉辦生日聚餐、線上活動等，讓您感受到特別尊榮。
                  </p>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="pt-3"
            >
              <h5>
                <i className="bi bi-person pe-2 text-primary"></i>
                專屬活動及體驗
              </h5>
              <ul>
                <li>
                  <p>
                    會員專場：我們定期舉辦專屬的會員活動或促銷，僅限會員參與，提供獨特的購物體驗。
                  </p>
                </li>
                <li>
                  <p>
                    體驗式活動：不定期舉辦特別的體驗活動，如工廠參訪、品酒會等，讓您有機會與品牌更深入地互動。
                  </p>
                </li>
              </ul>
            </motion.div>
          </>
        )}
        {memberLevel == '黃金會員' && (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="pt-3"
            >
              <h5>
                <i className="bi bi-credit-card pe-2 text-primary"></i>
                消費金額 5% 點數回饋
              </h5>
              <ul>
                <li>
                  <p>
                    積分累積加速：作為黃金會員，您在購物、參與活動等方面可以更快速地累積積分
                  </p>
                </li>
                <li>
                  <p>
                    獨家禮品或折扣券：您可以使用積分兌換獨家禮品或折扣券，讓您感受到不斷的價值回饋。
                  </p>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-3"
            >
              <h5>
                <i className="bi bi-cake pe-2 text-primary"></i>生日特典
              </h5>
              <ul>
                <li>
                  <p>
                    生日禮物：在您的生日當月，您可獲得獨家的生日禮物或優惠券，提升您的會員體驗。
                  </p>
                </li>
                <li>
                  <p>
                    生日活動參與權：參與獨家的生日活動，例如舉辦生日聚餐、線上活動等，讓您感受到特別尊榮。
                  </p>
                </li>
              </ul>
            </motion.div>
          </>
        )}
        {memberLevel == '銀級會員' && (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="pt-3"
            >
              <h5>
                <i className="bi bi-cake pe-2 text-primary"></i>生日特典
              </h5>
              <ul>
                <li>
                  <p>
                    生日禮物：在您的生日當月，您可獲得獨家的生日禮物或優惠券，提升您的會員體驗。
                  </p>
                </li>
                <li>
                  <p>
                    生日活動參與權：參與獨家的生日活動，例如舉辦生日聚餐、線上活動等，讓您感受到特別尊榮。
                  </p>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
      <hr className="my-4" />
      <motion.div
        className="px-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="sm-p">累積金額 ${total_sum}</div>
        <ProgressBar now={`${progressNumber}`} className="my-3" />
        {nextMemberLevel && (
          <>
            <h5>
              額外消費 {nextLevel - total_sum} 元 解鎖 {nextMemberLevel}
            </h5>
            {memberLevel == '黃金會員' && (
              <ul className="mt-3">
                <li>
                  <p>消費金額 10% 點數回饋</p>
                </li>
                <li>
                  <p>專屬活動及體驗</p>
                </li>
              </ul>
            )}
            {memberLevel == '銀級會員' && (
              <ul className="mt-3">
                <li>
                  <p>消費金額 5% 點數回饋</p>
                </li>
              </ul>
            )}
          </>
        )}
        {!nextMemberLevel && <h5>恭喜！您已是最高會員等級</h5>}
      </motion.div>
    </>
  )
}
