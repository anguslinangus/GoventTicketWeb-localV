import express from 'express'
import sequelize from '##/configs/db.js'
import { QueryTypes } from 'sequelize'
import authenticate from '##/middlewares/authenticate.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()
const corsOptions = {
  origin: 'http://govent.zeabur.app', // Adjust according to your frontend's origin
  credentials: true, // Allows cookies to be sent across origins
}
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

const router = express.Router()

router.get('/number', authenticate, async function (req, res) {
  try {
    let userID = req.user.id
    const coupon = await sequelize.query(
      'SELECT * FROM `member_coupon` JOIN `coupon` ON coupon.id = member_coupon.coupon_id WHERE user_id = :userID && valid =1 ',
      {
        replacements: { userID },
        type: QueryTypes.SELECT,
      }
    )
    const point = await sequelize.query(
      `SELECT point FROM member WHERE id = :userID`,
      { replacements: { userID }, type: QueryTypes.SELECT }
    )
    return res.send({
      status: 'success link cost',
      data: { coupon, point },
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
})

router.put('/delete', authenticate, (req, res) => {
  const userID = req.user.id
  const couponID = req.body.couponID
  const point = req.body.point
  console.log(userID)
  console.log(point)

  try {
    sequelize.query(
      'UPDATE `member_coupon` SET `valid`= 0 WHERE `user_id`= :userID && `coupon_id` = :couponID',
      {
        replacements: { userID, couponID },
        type: QueryTypes.UPDATE,
      }
    )
    sequelize.query('UPDATE `member` SET point = :point WHERE id = :userID', {
      replacements: { userID, point },
      type: QueryTypes.UPDATE,
    })
    res.send({ status: 'success', message: '更新成功' })
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'Failed to update user.' })
  }
  if (couponID == 0) {
    res.send({ status: 'success', message: '使用者無使用優惠券' })
    return
  }
})

export default router
