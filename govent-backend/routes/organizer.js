import express from 'express'
import multer from 'multer'
import path from 'path'
import sequelize from '#configs/db.js'
import { QueryTypes, DataTypes } from 'sequelize'
import authenticate from '##/middlewares/authenticate.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(express.json())

const router = express.Router()

const corsOptions = {
  origin: 'http://govent.zeabur.app', // Adjust according to your frontend's origin
  credentials: true, // Allows cookies to be sent across origins
}

app.use(cors(corsOptions))

// Use cookieParser middleware
app.use(cookieParser())

// 处理 quill 编辑器上传的图片
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/contain') // 上传的图片将保存在 public/images 目录下
  },
  filename: (req, file, cb) => {
    cb(null, 'ct_' + Date.now() + path.extname(file.originalname))
  },
})
const upload = multer({ storage })

// 处理 banner 图片上传
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/banner') // 上传的 banner 图片将保存在 public/images/banner 目录下
  },
  filename: (req, file, cb) => {
    cb(null, 'bn_' + Date.now() + path.extname(file.originalname))
  },
})
const bannerUpload = multer({ storage: bannerStorage })

router.get('/', authenticate, async function (req, res) {
  // const { Cart } = sequelize.models
  try {
    // findAll 是回傳所有資料
    const result = await sequelize.query(
      'SELECT organizer.* ' +
        'FROM `organizer` ' +
        'WHERE organizer.user_id = ? ',
      {
        replacements: [req.user.id], // 使用占位符传递参数
        type: QueryTypes.SELECT,
      }
    )
    if (result.length > 0) {
      return res.json({
        status: 'success',
        message: 'success',
        data: { result },
      })
    }
    return res.json({ status: 'success', message: 'noDataFound' })
  } catch (error) {
    console.error('Error fetching user data:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch user data.' })
  }
})

router.get('/event', authenticate, async function (req, res) {
  // const { Cart } = sequelize.models
  try {
    // findAll 是回傳所有資料
    const result = await sequelize.query(
      'SELECT event.*, organizer.user_id ' +
        'FROM `event` ' +
        'JOIN `organizer` ON organizer.id = event.merchat_id ' +
        'WHERE organizer.user_id = ? ',
      {
        replacements: [req.user.id], // 使用占位符传递参数
        type: QueryTypes.SELECT,
      }
    )

    // 標準回傳 JSON
    return res.json({ status: 'success', data: { result } })
  } catch (error) {
    console.error('Error fetching user data:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch user data.' })
  }
})

// 处理 quill 编辑器上传的图片的路由
router.post('/contain-image', upload.single('upload'), (req, res) => {
  const imageUrl = `http://govent-backend.zeabur.app/images/contain/${req.file.filename}`
  res.status(201).json({ url: imageUrl })
})

// 处理新增活动，包括处理 banner 文件
router.post('/add-event', bannerUpload.single('banner'), async (req, res) => {
  const {
    merchat_id,
    event_name,
    event_type_id,
    place,
    str,
    address,
    ticket_ins,
    start_date,
    end_date,
    sell_start_date,
    sell_end_date,
    content,
  } = req.body

  try {
    // 处理上传的 banner 图片并保存
    const bannerFileName = req.file ? req.file.filename : null

    // 使用 Sequelize 或其他方式新增活动数据
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000)
    await sequelize.query(
      'INSERT INTO `event` (event_id, merchat_id, event_name, event_type_id, place, banner, str, address, ticket_ins, start_date, end_date, sell_start_date, sell_end_date, content, create_at, valid) VALUES (:event_id, :merchat_id, :event_name, :event_type_id, :place, :banner, :str, :address, :ticket_ins, :start_date, :end_date, :sell_start_date, :sell_end_date, :content, :create_at, 0)',
      {
        replacements: {
          event_id: randomNumber,
          merchat_id,
          event_name,
          event_type_id,
          place,
          banner: bannerFileName,
          str,
          address,
          ticket_ins,
          start_date,
          end_date,
          sell_start_date,
          sell_end_date,
          content,
          create_at: new Date(),
        },
        type: QueryTypes.INSERT,
      }
    )

    res.json({ status: 'success', data: { event_id: randomNumber } })
  } catch (error) {
    console.error('Error creating event:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to create event.' })
  }
})

router.post('/contain-image', upload.single('upload'), (req, res) => {
  const imageUrl = `http://govent-backend.zeabur.app/images/contain/${req.file.filename}`
  res.status(201).json({ url: imageUrl })
})

router.post('/add-options', async (req, res) => {
  const EventOption = sequelize.define(
    'EventOption',
    {
      // 模型定義
      event_id: DataTypes.INTEGER,
      option_name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      max_quantity: DataTypes.INTEGER,
      contain: DataTypes.STRING,
    },
    {
      // 指定表格名稱
      tableName: 'event_options',
      timestamps: false,
    }
  )

  const { data1, data2, data3 } = req.body

  try {
    // 使用 Sequelize 或其他方式新增活动数据
    const optionsToCreate = []

    if (data1) optionsToCreate.push(data1)
    if (data2) optionsToCreate.push(data2)
    if (data3) optionsToCreate.push(data3)

    if (optionsToCreate.length > 0) {
      await EventOption.bulkCreate(optionsToCreate)
      res.json({ status: 'success' })
    } else {
      res.json({ status: 'success', message: 'No valid data to create.' })
    }
  } catch (error) {
    console.error('Error creating event:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to create option.' })
  }
})

router.get('/event/:eid', authenticate, async (req, res) => {
  try {
    const eid = req.params.eid
    const result = await sequelize.query(
      'SELECT event.* , activity_category.activity_name ' +
        'FROM `event` ' +
        'JOIN `activity_category` ON activity_category.id = event.event_type_id ' +
        'WHERE event.event_id = :eid ',
      {
        type: QueryTypes.SELECT,
        replacements: { eid: eid },
      }
    )
    res.json({ status: 'success', data: { result } })
    // 将订单数据发送给前端
  } catch (error) {
    console.error('Error fetching order data:', error)
    res.status(500).json({ status: 'error', message: '500' })
  }
})

router.get('/event/order/:eid', async (req, res) => {
  const eid = req.params.eid
  try {
    const userOrders = await sequelize.query(
      'SELECT order_info FROM user_order ',
      {
        type: QueryTypes.SELECT,
      }
    )
    let total = 0
    let qty = 0

    userOrders.forEach((userOrder) => {
      const orderInfos = JSON.parse(userOrder.order_info)

      const filteredEvents = orderInfos.filter(
        (orderInfo) => orderInfo.eventId == eid
      )
      console.log(filteredEvents)
      filteredEvents.forEach((event) => {
        total += event.price
        qty += event.qty
      })
    })

    res.json({ status: 'success', data: { total, qty } })
  } catch (error) {
    console.error('Error fetching user order data:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch user order data.' })
  }
})

router.get('/event/option/:eid', authenticate, async (req, res) => {
  try {
    const eid = req.params.eid
    const result = await sequelize.query(
      'SELECT event_options.* ' +
        'FROM `event_options` ' +
        'WHERE event_options.event_id = :eid ',
      {
        type: QueryTypes.SELECT,
        replacements: { eid: eid },
      }
    )
    res.json({ status: 'success', data: { result } })
    // 将订单数据发送给前端
  } catch (error) {
    console.error('Error fetching order data:', error)
    res.status(500).json({ status: 'error', message: '500' })
  }
})

router.get('/event/ticket/:eid', authenticate, async (req, res) => {
  try {
    const eid = req.params.eid
    const result = await sequelize.query(
      'SELECT ticket.* , event_options.event_id, event_options.option_name, event.event_id, user_order.order_id, user_order.user_id, user_order.created_at, member.name ' +
        'FROM `ticket` ' +
        'JOIN `event_options` ON ticket.event_option_id = event_options.id ' +
        'JOIN `event` ON event.event_id = event_options.event_id ' +
        'JOIN `user_order` ON user_order.order_id = ticket.order_number ' +
        'JOIN `member` ON user_order.user_id = member.id ' +
        'WHERE event.event_id = :eid ',
      {
        type: QueryTypes.SELECT,
        replacements: { eid: eid },
      }
    )
    res.json({ status: 'success', data: { result } })
    // 将订单数据发送给前端
  } catch (error) {
    console.error('Error fetching order data:', error)
    res.status(500).json({ status: 'error', message: '500' })
  }
})

router.post('/update-organizer', authenticate, async (req, res) => {
  const {
    organizer_type,
    name,
    bank_code,
    bank_branch,
    bank_name,
    amount_number,
    owner_name,
    business_invoice,
  } = req.body

  try {
    const updateOrganizer = await sequelize.query(
      'UPDATE `organizer` SET organizer_type = :organizer_type, name = :name, bank_code = :bank_code, bank_branch = :bank_branch, bank_name = :bank_name, amount_number = :amount_number, owner_name = :owner_name, business_invoice = :business_invoice, update_at = :update_at WHERE user_id = :user_id',
      {
        replacements: {
          organizer_type,
          name,
          bank_code,
          bank_branch,
          bank_name,
          amount_number,
          owner_name,
          business_invoice,
          update_at: new Date(),
          user_id: req.user.id,
        },
        type: QueryTypes.INSERT,
      }
    )

    res.json({ status: 'success', data: { updateOrganizer } })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ status: 'error', message: 'Failed to update user.' })
  }
})

router.post('/add-organizer', authenticate, async (req, res) => {
  const {
    organizer_type,
    name,
    bank_code,
    bank_branch,
    bank_name,
    amount_number,
    owner_name,
    business_invoice,
  } = req.body

  try {
    const addOrganizer = await sequelize.query(
      'INSERT INTO `organizer` (user_id, organizer_type, name, bank_code, bank_branch, bank_name, amount_number, owner_name, business_invoice, created_at, update_at, valid) VALUES (:user_id, :organizer_type, :name, :bank_code, :bank_branch, :bank_name, :amount_number, :owner_name, :business_invoice, :created_at, :update_at, 0)',
      {
        replacements: {
          user_id: req.user.id,
          organizer_type,
          name,
          bank_code,
          bank_branch,
          bank_name,
          amount_number,
          owner_name,
          business_invoice,
          created_at: new Date(),
          update_at: new Date(),
        },
        type: QueryTypes.INSERT,
      }
    )

    res.json({ status: 'success', data: { addOrganizer } })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ status: 'error', message: 'Failed to update user.' })
  }
})

export default router
