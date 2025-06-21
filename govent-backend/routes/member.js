import express from 'express'
import sequelize from '#configs/db.js'
import { QueryTypes, DataTypes } from 'sequelize'
import authenticate from '##/middlewares/authenticate.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()

const router = express.Router()
app.use(express.json())

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

const corsOptions = {
  origin: 'http://govent.zeabur.app', // Adjust according to your frontend's origin
  credentials: true, // Allows cookies to be sent across origins
}

app.use(cors(corsOptions))

// Use cookieParser middleware
app.use(cookieParser())

router.get('/', authenticate, async function (req, res) {
  // const { Cart } = sequelize.models
  try {
    // findAll 是回傳所有資料
    const posts = await sequelize.query('SELECT * FROM `member` WHERE id = ?', {
      replacements: [req.user.id], // 使用占位符传递参数
      type: QueryTypes.SELECT,
    })

    // 標準回傳 JSON
    return res.json({ status: 'success', data: { posts } })
  } catch (error) {
    console.error('Error fetching user data:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch user data.' })
  }
})

// 處理 POST 請求，更新用戶資料
router.post('/update', async (req, res) => {
  const { id, name, gender, birthday, phone, username } = req.body

  try {
    // 使用 Sequelize 或其他方式更新用戶資料
    const updatedUser = await sequelize.query(
      'UPDATE `member` SET name = :name, gender = :gender, birthday = :birthday, phone = :phone, username = :username WHERE id = :id',
      {
        replacements: { id, name, gender, birthday, phone, username },
        type: QueryTypes.UPDATE,
      }
    )

    res.json({ status: 'success', data: { updatedUser } })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ status: 'error', message: 'Failed to update user.' })
  }
})

router.get('/favorites', authenticate, async function (req, res) {
  try {
    const result = await sequelize.query(
      'SELECT favorites.*, event.event_name, event.banner, event.start_date ' +
        'FROM `favorites` ' +
        'JOIN `event` ON favorites.pid = event.event_id ' +
        'WHERE favorites.uid = ? ',
      {
        replacements: [req.user.id],
        type: QueryTypes.SELECT,
      }
    )

    return res.json({ status: 'success link favorites', data: { result } })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
})

router.post('/delete/:eventId', authenticate, async (req, res) => {
  const eventId = req.params.eventId
  const user_id = req.user.id
  console.log(user_id)
  try {
    await sequelize.query(
      'DELETE FROM `favorites` WHERE pid = :eventId AND uid = :user_id',
      {
        replacements: {
          eventId: eventId,
          user_id: user_id,
        },
        type: QueryTypes.DELETE,
      }
    )
    res.json({ success: true, message: 'Favorite deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete favorite' })
  }
})

router.get('/cost', authenticate, async function (req, res) {
  try {
    const result = await sequelize.query(
      'SELECT SUM(total) AS total_sum FROM `user_order` WHERE user_id = ?',
      {
        replacements: [req.user.id], // 使用占位符传递参数
        type: QueryTypes.SELECT,
      }
    )

    return res.json({ status: 'success link cost', data: { result } })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
})

router.get('/coupon', authenticate, async function (req, res) {
  try {
    const result = await sequelize.query(
      'SELECT member_coupon.*, coupon.* ' +
        'FROM `member_coupon` ' +
        'JOIN `coupon` ON member_coupon.coupon_id = coupon.id ' +
        'WHERE member_coupon.user_id = ?',
      {
        replacements: [req.user.id],
        type: QueryTypes.SELECT,
      }
    )

    return res.json({ status: 'success link coupon', data: { result } })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
})

router.post('/add-coupon', authenticate, async (req, res) => {
  const CouponModel = sequelize.define(
    'Coupon',
    {
      coupon_code: DataTypes.STRING,
    },
    {
      tableName: 'coupon',
      timestamps: false,
    }
  )
  const MemberCouponModel = sequelize.define(
    'MemberCoupon',
    {
      coupon_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      valid: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 將 valid 欄位預設為 1
      },
    },
    {
      tableName: 'member_coupon',
      timestamps: false,
    }
  )

  try {
    const coupon = req.body.coupon

    if (!coupon) {
      return res.status(400).json({ status: 'error', message: '請輸入優惠碼' })
    }

    const existingCoupon = await CouponModel.findOne({
      where: {
        coupon_code: coupon,
      },
    })

    if (existingCoupon) {
      // 找到匹配的记录
      const memberId = req.user.id // 你的用户ID

      const existingMemberCoupon = await MemberCouponModel.findOne({
        where: {
          coupon_id: existingCoupon.id,
          user_id: memberId,
        },
      })

      if (existingMemberCoupon) {
        return res.status(500).json({
          status: 'error',
          message: '已經擁有此優惠卷',
        })
      }

      await MemberCouponModel.create({
        coupon_id: existingCoupon.id,
        user_id: memberId,
      })
      console.log(
        '新增成功, 用戶編號:',
        memberId,
        '新增一筆優惠卷編號:',
        existingCoupon.id
      )
      res.json({ status: 'success', message: '新增優惠卷成功' })
    } else {
      // 未找到匹配的记录
      console.log(
        'Coupon code does not exist. Proceed with adding to member_coupon.'
      )
      res.json.status(500)({
        status: 'error',
        message: '編號輸入錯誤',
      })
      // 进行其他处理
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: '編號輸入錯誤' })
  }
})

router.get('/order', authenticate, async function (req, res) {
  try {
    const result = await sequelize.query(
      'SELECT user_order.* ' +
        'FROM `user_order` ' +
        'WHERE user_order.user_id = ? ' +
        'ORDER BY user_order.id DESC', // 在此添加 ORDER BY 子句,
      {
        replacements: [req.user.id],
        type: QueryTypes.SELECT,
      }
    )

    return res.json({ status: 'success link order', data: { result } })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
})

router.get('/order/event/:eventId', async function (req, res) {
  const eventId = req.params.eventId
  console.log(eventId)
  try {
    const result = await sequelize.query(
      'SELECT event.* ' + 'FROM `event` ' + 'WHERE event.event_id = :eventId',
      {
        replacements: { eventId: eventId },
        type: QueryTypes.SELECT,
      }
    )

    return res.json({ status: 'success link event', data: { result } })
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ status: 'error', message: 'Failed to fetch data.' })
  }
})

router.get('/order/:orderId', authenticate, async (req, res) => {
  try {
    const orderId = req.params.orderId
    const result = await sequelize.query(
      'SELECT user_order.* ' +
        'FROM `user_order` ' +
        'WHERE user_order.order_id = :orderId ',
      {
        type: QueryTypes.SELECT,
        replacements: { orderId: orderId },
      }
    )
    if (result[0].user_id == req.user.id) {
      res.json({ status: 'success', data: { result } })
    } else {
      res.status(403).json({ status: 'error', message: '403' })
    }
    // 将订单数据发送给前端
  } catch (error) {
    console.error('Error fetching order data:', error)
    res.status(500).json({ status: 'error', message: '500' })
  }
})

router.get('/order/ticket/:orderId', async (req, res) => {
  const orderId = req.params.orderId

  try {
    const result = await sequelize.query(
      'SELECT ticket.*, event_options.option_name, event_options.event_id, event_options.contain ' +
        'FROM `ticket` ' +
        'JOIN `event_options` ON ticket.event_option_id = event_options.id ' +
        'WHERE ticket.order_number = :orderId',
      {
        type: QueryTypes.SELECT,
        replacements: { orderId: orderId },
      }
    )

    // 将订单数据发送给前端
    res.json({ status: 'success', data: { result } })
  } catch (error) {
    console.error('Error fetching order data:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch order data.' })
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar_' + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

router.post(
  '/avatar',
  upload.single('avatar'),
  authenticate,
  async (req, res) => {
    try {
      console.log(req.file.filename)
      // 使用 Sequelize 更新用户资料
      const updateAvatar = await sequelize.query(
        'UPDATE `member` SET avatar = :avatar WHERE id = :id',
        {
          replacements: { avatar: req.file.filename, id: req.user.id },
          type: QueryTypes.UPDATE,
        }
      )

      res.json({ status: 'success', message: { updateAvatar } })
    } catch (error) {
      console.error('Error updating user avatar:', error)
      res
        .status(500)
        .json({ status: 'error', message: 'Failed to update user avatar' })
    }
  }
)

export default router
