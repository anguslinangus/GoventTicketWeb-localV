import express from 'express'
const router = express.Router()

// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import sequelize from '#configs/db.js'
const { User } = sequelize.models

// 驗証加密密碼字串用
import { compareHash } from '#db-helpers/password-hash.js'

// JWT
import jwt from 'jsonwebtoken'

// 上傳檔案用使用multer
import path from 'path'
import multer from 'multer'

// Email 相關
import transporter from '#configs/mail.js'

const upload = multer()

// multer的設定值 - START
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    const newFilename = req.user.id
    callback(null, newFilename + path.extname(file.originalname))
  },
})
const uploadAvatar = multer({ storage: storage })

// === 認證相關路由 ===

// POST - 用戶註冊
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

  try {
    // 檢查必要資料
    if (!username || !password || !name) {
      return res.json({ status: 'error', message: '缺少必要資料' })
    }

    // 檢查 email 是否被註冊過
    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      return res.status(409).json({ 
        status: 'error', 
        message: 'Email 已經被註冊' 
      })
    }

    // 整理地址
    const fullAddress = county && township && address 
      ? `${county}${township}${address}` 
      : null

    // 創建新用戶
    const newUser = await User.create({
      username,
      password,
      name,
      gender,
      birthday,
      phone: cellphone,
      address: fullAddress,
      avatar: 'default_user.png',
      point: 0
    })

    return res.status(201).json({
      status: 'success',
      message: '已成功註冊',
      data: { id: newUser.id }
    })

  } catch (error) {
    console.error('註冊失敗', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '註冊發生錯誤' 
    })
  }
})

// POST - 用戶登入
router.post('/signin', upload.none(), async (req, res) => {
  const { username, password } = req.body

  try {
    // 查找用戶（包含 organizer 信息）
    const user = await User.findOne({
      where: { username, password },
      include: [{
        association: 'organizer',
        required: false
      }],
      raw: false
    })

    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication failed' 
      })
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        organizer: user.organizer?.id || null,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '120m' }
    )

    // 設置 cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    return res.status(200).json({ 
      status: 'success',
      message: 'Login successful' 
    })

  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ 
      status: 'error',
      message: '登入過程發生錯誤' 
    })
  }
})

// POST - Google 登入
router.post('/googleSignIn', async (req, res) => {
  const { googleUser } = req.body

  try {
    let user = await User.findOne({ where: { username: googleUser.email } })

    if (!user) {
      // 創建新的 Google 用戶
      user = await User.create({
        username: googleUser.email,
        name: googleUser.name,
        avatar: 'default_user.png'
      })
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '120m' }
    )

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ 
      status: 'success',
      message: 'Google login successful' 
    })

  } catch (error) {
    console.error('Google authentication error:', error)
    return res.status(500).json({ 
      status: 'error',
      message: 'Google 登入發生錯誤' 
    })
  }
})

// GET - 驗證 token
router.get('/verifyToken', authenticate, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// POST - 登出
router.post('/signout', (req, res) => {
  res.clearCookie('auth_token')
  res.json({ status: 'success', message: 'Logged out successfully' })
})

// === 用戶資料管理路由 ===

// GET - 得到所有會員資料（管理員用）
router.get('/', async function (req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // 不返回密碼
    })
    
    return res.json({ status: 'success', data: { users } })
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: '獲取用戶資料失敗' 
    })
  }
})

// GET - 得到單筆資料
router.get('/:id', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      raw: true
    })

    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: '用戶不存在' 
      })
    }

    return res.json({ status: 'success', data: { user } })
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: '獲取用戶資料失敗' 
    })
  }
})

// POST - 上傳頭像
router.post('/upload-avatar', authenticate, uploadAvatar.single('avatar'), 
  async function (req, res) {
    if (!req.file) {
      return res.json({ status: 'error', message: '沒有上傳檔案' })
    }

    try {
      const id = req.user.id
      const [affectedRows] = await User.update(
        { avatar: req.file.filename },
        { where: { id } }
      )

      if (!affectedRows) {
        return res.json({
          status: 'error',
          message: '更新失敗或沒有資料被更新',
        })
      }

      return res.json({
        status: 'success',
        data: { avatar: req.file.filename },
      })
    } catch (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: '上傳頭像失敗' 
      })
    }
  }
)

// PUT - 更新密碼
router.put('/:id/password', authenticate, async function (req, res) {
  const id = getIdParam(req)

  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const { origin, new: newPassword } = req.body

  if (!origin || !newPassword) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  try {
    const dbUser = await User.findByPk(id, { raw: true })

    if (!dbUser) {
      return res.json({ status: 'error', message: '使用者不存在' })
    }

    // 驗證原密碼
    const isValid = await compareHash(origin, dbUser.password)
    if (!isValid) {
      return res.json({ status: 'error', message: '原密碼錯誤' })
    }

    // 更新密碼
    const [affectedRows] = await User.update(
      { password: newPassword },
      { where: { id } }
    )

    if (!affectedRows) {
      return res.json({
        status: 'error',
        message: '密碼更新失敗',
      })
    }

    return res.json({ status: 'success', data: null })
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: '密碼更新過程發生錯誤' 
    })
  }
})

// PUT - 更新個人資料
router.put('/:id/profile', authenticate, async function (req, res) {
  const id = getIdParam(req)

  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  try {
    const updateData = req.body
    // 移除不應該被更新的欄位
    delete updateData.id
    delete updateData.password
    delete updateData.username

    const [affectedRows] = await User.update(updateData, { where: { id } })

    if (!affectedRows) {
      return res.json({
        status: 'error',
        message: '資料更新失敗',
      })
    }

    return res.json({ status: 'success', data: null })
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: '個人資料更新失敗' 
    })
  }
})

export default router 