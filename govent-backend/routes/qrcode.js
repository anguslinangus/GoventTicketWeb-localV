/* eslint-disable import/no-unresolved */
import express from 'express'
import sequelize from '##/configs/db.js'
import { QueryTypes } from 'sequelize'
import QRCode from 'qrcode'

const { ticket } = sequelize.models

const router = express.Router()

router.post('/', (req, res) => {
  let number = Math.floor(Math.random() * 100000)
  const body = req.body
  let json = {
    ticket_code: `${body.eventID}-${number}`,
    order_number: body.orderID,
    event_option_id: body.eventOptionId,
    holding_time: body.holdingTime,
  }
  //把產生的資料寫入ticket資料表
  ticket.create(json)
  //將產生的QRcode儲存在public
  //檔案名稱對應ticket_code欄位
  // QRCode.toFile(
  //   `public/images/qrcode/${body.eventID}-${number}.png`,
  //   `${body.eventID}-${number}`,
  //   {
  //     color: {
  //       dark: '#ffffff',
  //       light: '#000000',
  //     },
  //     function(err) {
  //       if (err) throw err
  //       console.log('done')
  //     },
  //   }
  // )
  res.send({ message: 'success', tickCode: `${body.eventID}-${number}` })
})

//拿取訂單資訊
router.get('/data', async (req, res) => {
  let orderID = req.query.orderID
  let result = await sequelize.query(
    `SELECT order_info FROM user_order WHERE order_id = :orderID`,
    { replacements: { orderID }, type: QueryTypes.SELECT }
  )
  res.send({ message: 'success', data: result })
})

export default router
