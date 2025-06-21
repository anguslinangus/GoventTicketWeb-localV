import express from 'express'
import sequelize from '#configs/db.js'
import { QueryTypes } from 'sequelize'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import dotenv from 'dotenv'
import path from 'path'

// 中介軟體
import authenticate from '#middlewares/authenticate.js'

// 工具函數
import { getIdParam } from '#db-helpers/db-tool.js'
import { compareHash } from '#db-helpers/password-hash.js'

// 郵件服務
import transporter from '#configs/mail.js'

dotenv.config()

const router = express.Router()

// Multer 配置 - 用於頭像上傳
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    const newFilename = req.user.id
    callback(null, newFilename + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

// 資料庫模型
const { User } = sequelize.models

// ==================== 認證相關路由 ====================

// 註冊路由
router.post('/signup', async function (req, res) {
  const {
    username,
    password,
    name,
    gender,
    birthday,
    cellphone,
    county,
    township,
    address,
  } = req.body

  console.log('註冊請求:', req.body)

  try {
    // 檢查 email 是否被註冊過
    const emailExists = await sequelize.query(
      'SELECT * FROM member WHERE username = :username',
      {
        replacements: { username: username },
        type: QueryTypes.SELECT,
      }
    )

    if (emailExists.length > 0) {
      return res
        .status(409)
        .json({ status: 'error', message: 'Email 已經被註冊' })
    }

    // 調整地址跟時間到資料庫想要的格式
    const fullAddress = `${county}${township}${address}`
    const createTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const avatar = 'default_user.png'
    const point = 0

    // 新增註冊者資料
    const newUser = await sequelize.query(
      'INSERT INTO member (username, password, name, gender, birthday, phone, address, create_at, avatar, point) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      {
        replacements: [
          username,
          password,
          name,
          gender,
          birthday,
          cellphone,
          fullAddress,
          createTime,
          avatar,
          point,
        ],
        type: QueryTypes.INSERT,
      }
    )

    return res
      .status(201)
      .json({ status: 'success', message: '已成功註冊', data: newUser })
  } catch (error) {
    console.log('註冊失敗', error)
    return res.status(500).json({ status: 'error', message: '註冊發生錯誤' })
  }
})

// 登入路由
router.post('/signin', upload.none(), async (req, res) => {
  const { username, password } = req.body
  
  console.log('=== 登入請求開始 ===')
  console.log('接收到的數據:', { username, password })

  try {
    const user = await sequelize.query(
      'SELECT member.*, organizer.id AS merchat_id ' +
        'FROM member ' +
        'LEFT JOIN organizer ON organizer.user_id = member.id ' +
        'WHERE username = :username AND password = :password ',
      {
        replacements: { username, password },
        type: QueryTypes.SELECT,
      }
    )
    
    console.log('資料庫查詢結果:', user)
    console.log('查詢到的用戶數量:', user.length)

    if (user.length > 0) {
      console.log('登入成功，準備生成Token')
      const token = jwt.sign(
        {
          id: user[0].id,
          username: user[0].username,
          name: user[0].name,
          gender: user[0].gender,
          birthday: user[0].birthday,
          phone: user[0].phone,
          address: user[0].address,
          avatar: user[0].avatar,
          organizer: user[0].merchat_id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '120m' }
      )

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })

      return res.status(200).json({ message: 'Login successful' })
    } else {
      console.log('用戶名或密碼錯誤，查詢無結果')
      return res.status(401).json({ message: 'Authentication failed' })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return res
      .status(500)
      .json({ message: 'An error occurred during authentication' })
  }
})

// Google 登入路由
router.post('/googleSignIn', async (req, res) => {
  const { googleUser } = req.body
  console.log('Google登入:', googleUser)

  try {
    let user = await sequelize.query(
      'SELECT * FROM member WHERE username = :username',
      {
        replacements: { username: googleUser.email },
        type: QueryTypes.SELECT,
      }
    )

    if (user.length === 0) {
      const createTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      const avatar = 'default_user.png'

      await sequelize.query(
        'INSERT INTO member (username, name, create_at, avatar) VALUES (?, ?, ?, ?)',
        {
          replacements: [googleUser.email, googleUser.name, createTime, avatar],
          type: QueryTypes.INSERT,
        }
      )

      // 重新查詢用戶資料
      user = await sequelize.query(
        'SELECT * FROM member WHERE username = :username',
        {
          replacements: { username: googleUser.email },
          type: QueryTypes.SELECT,
        }
      )
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        username: user[0].username,
        name: user[0].name,
        avatar: user[0].avatar,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '120m' }
    )

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    return res.status(200).json({
      message: '登入成功',
      user: {
        id: user[0].id,
        username: user[0].username,
        name: user[0].name,
        avatar: user[0].avatar,
      },
      token,
    })
  } catch (error) {
    console.error('認證錯誤', error)
    return res.status(500).json({ message: '在認證時連線發生錯誤' })
  }
})

// 驗證Token路由
router.get('/verifyToken', authenticate, (req, res) => {
  res.json({ message: 'User is authenticated', user: req.user })
})

// 登出路由
router.get('/signout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  })
  res.json({ message: 'User has signed out', user: null })
})

// 忘記密碼寄送email路由
router.post('/forgetPasswordEmail', async (req, res) => {
  const { email } = req.body

  try {
    // 檢查用戶是否存在
    const user = await sequelize.query(
      'SELECT * FROM member WHERE username = :email',
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      }
    )

    if (user.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: '此電子郵件未註冊' 
      })
    }

    // 生成重設密碼的token
    const resetToken = jwt.sign(
      { userId: user[0].id, email: user[0].username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    // 發送重設密碼郵件
    const resetUrl = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'GoVent - 重設密碼',
      html: `
        <h2>重設密碼請求</h2>
        <p>請點擊以下連結重設您的密碼：</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>此連結將在1小時後過期。</p>
      `
    }

    await transporter.sendMail(mailOptions)

    return res.json({ 
      status: 'success', 
      message: '重設密碼郵件已發送' 
    })
  } catch (error) {
    console.error('發送重設密碼郵件失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '發送郵件失敗' 
    })
  }
})

// ==================== 用戶管理路由 ====================

// GET - 得到所有會員資料 (管理員用)
router.get('/', async function (req, res) {
  try {
    const users = await sequelize.query(
      'SELECT id, username, name, gender, birthday, phone, address, avatar, point, create_at FROM member',
      {
        type: QueryTypes.SELECT,
      }
    )
    
    return res.json({ status: 'success', data: { users } })
  } catch (error) {
    console.error('獲取用戶列表失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '獲取用戶列表失敗' 
    })
  }
})

// GET - 得到單筆用戶資料
router.get('/:id', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  try {
    const user = await sequelize.query(
      'SELECT id, username, name, gender, birthday, phone, address, avatar, point, create_at FROM member WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    )

    if (user.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: '用戶不存在' 
      })
    }

    return res.json({ status: 'success', data: { user: user[0] } })
  } catch (error) {
    console.error('獲取用戶資料失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '獲取用戶資料失敗' 
    })
  }
})

// POST - 頭像上傳
router.post(
  '/upload-avatar',
  authenticate,
  upload.single('avatar'),
  async function (req, res) {
    if (!req.file) {
      return res.json({ status: 'fail', message: '沒有上傳檔案' })
    }

    try {
      const id = req.user.id
      const filename = req.file.filename

      // 對資料庫執行update
      const [results] = await sequelize.query(
        'UPDATE member SET avatar = :avatar WHERE id = :id',
        {
          replacements: { avatar: filename, id },
          type: QueryTypes.UPDATE,
        }
      )

      if (results.affectedRows === 0) {
        return res.json({
          status: 'error',
          message: '更新失敗或沒有資料被更新',
        })
      }

      return res.json({
        status: 'success',
        data: { avatar: filename },
      })
    } catch (error) {
      console.error('頭像上傳失敗:', error)
      return res.status(500).json({ 
        status: 'error', 
        message: '頭像上傳失敗' 
      })
    }
  }
)

// PUT - 更新會員密碼
router.put('/:id/password', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const userPassword = req.body

  // 檢查必要資料
  if (!id || !userPassword.origin || !userPassword.new) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  try {
    // 查詢資料庫目前的資料
    const dbUser = await sequelize.query(
      'SELECT * FROM member WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    )

    if (dbUser.length === 0) {
      return res.json({ status: 'error', message: '使用者不存在' })
    }

    // 驗證原密碼
    const isValid = await compareHash(userPassword.origin, dbUser[0].password)

    if (!isValid) {
      return res.json({ status: 'error', message: '密碼錯誤' })
    }

    // 更新密碼
    const [results] = await sequelize.query(
      'UPDATE member SET password = :password WHERE id = :id',
      {
        replacements: { password: userPassword.new, id },
        type: QueryTypes.UPDATE,
      }
    )

    if (results.affectedRows === 0) {
      return res.json({ status: 'error', message: '更新失敗' })
    }

    return res.json({ status: 'success', data: null })
  } catch (error) {
    console.error('密碼更新失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '密碼更新失敗' 
    })
  }
})

// PUT - 更新會員資料(排除密碼)
router.put('/:id/profile', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const user = req.body

  // 檢查必要資料
  if (!id || !user.name) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  try {
    // 查詢資料庫目前的資料
    const dbUser = await sequelize.query(
      'SELECT * FROM member WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    )

    if (dbUser.length === 0) {
      return res.json({ status: 'error', message: '使用者不存在' })
    }

    // 建立更新語句
    const updateFields = []
    const replacements = { id }

    if (user.name) {
      updateFields.push('name = :name')
      replacements.name = user.name
    }
    if (user.gender !== undefined) {
      updateFields.push('gender = :gender')
      replacements.gender = user.gender
    }
    if (user.birthday) {
      updateFields.push('birthday = :birthday')
      replacements.birthday = user.birthday
    }
    if (user.phone) {
      updateFields.push('phone = :phone')
      replacements.phone = user.phone
    }
    if (user.address) {
      updateFields.push('address = :address')
      replacements.address = user.address
    }

    if (updateFields.length === 0) {
      return res.json({ status: 'error', message: '沒有要更新的資料' })
    }

    // 更新用戶資料
    const [results] = await sequelize.query(
      `UPDATE member SET ${updateFields.join(', ')} WHERE id = :id`,
      {
        replacements,
        type: QueryTypes.UPDATE,
      }
    )

    if (results.affectedRows === 0) {
      return res.json({ status: 'error', message: '更新失敗' })
    }

    return res.json({ status: 'success', data: null })
  } catch (error) {
    console.error('用戶資料更新失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '用戶資料更新失敗' 
    })
  }
})

export default router 