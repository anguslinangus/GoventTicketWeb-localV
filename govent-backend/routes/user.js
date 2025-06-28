import express from 'express'
import sequelize from '#configs/db.js'
import { QueryTypes } from 'sequelize'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import dotenv from 'dotenv'

// 中介軟體
import authenticate from '#middlewares/authenticate.js'

// 郵件服務
import transporter from '#configs/mail.js'

dotenv.config()

const router = express.Router()
const upload = multer()

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

    // 生成6位數驗證碼
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 將驗證碼存儲到資料庫（使用簡單的方式，也可以建立專門的otp表）
    // 這裡我們暫時存儲在 session 或使用記憶體，實際應用中建議使用Redis或資料庫
    
    // 發送驗證碼郵件
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'Govent - 密碼重設驗證碼',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <title>Govent - 密碼重設驗證碼</title>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <style>
            * { text-size-adjust: 100%; }
            html { height: 100%; width: 100%; }
            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          </style>
        </head>
        <body style="background-color:#f4f4f4; margin:0; width:100%;">
          <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" width="100%" style="padding: 40px 10px;" bgcolor="#f4f4f4">
                <div style="margin:0 auto; width:100%; max-width:640px;">
                  <!-- Header -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left" width="100%" bgcolor="#121212" style="padding: 48px 32px 16px 32px;">
                        <h1 style="color:#ffffff; font-size:24px; font-weight:bold; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0; line-height:1.4;">
                          🔢 Govent 密碼重設驗證碼
                        </h1>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Content -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left" width="100%" bgcolor="#121212" style="padding: 16px 32px;">
                        <p style="color:#ffffff; font-size:16px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 16px 0; line-height:1.6;">
                          親愛的 Govent 會員您好，
                        </p>
                        <p style="color:#ffffff; font-size:16px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 24px 0; line-height:1.6;">
                          請輸入以下 6 位數驗證碼來重設您的密碼：
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- OTP Code -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" width="100%" bgcolor="#121212" style="padding: 0px 32px 32px 32px;">
                        <div style="background-color:#F16E0F; border-radius:8px; padding:20px; display:inline-block;">
                          <span style="color:#ffffff; font-size:32px; font-weight:bold; font-family:'Courier New',monospace; letter-spacing:8px;">
                            ${verificationCode}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Footer Info -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left" width="100%" bgcolor="#121212" style="padding: 0px 32px 48px 32px;">
                        <p style="color:#cccccc; font-size:14px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 12px 0; line-height:1.6;">
                          ⚠️ 此驗證碼將在 <strong style="color:#F16E0F;">30分鐘後</strong> 過期。
                        </p>
                        <p style="color:#cccccc; font-size:14px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 12px 0; line-height:1.6;">
                          如果您沒有要求重設密碼，請忽略此郵件。
                        </p>
                        <p style="color:#cccccc; font-size:14px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0; line-height:1.6;">
                          如有任何問題，請聯繫 Govent 客服團隊。
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>`
    }

    await transporter.sendMail(mailOptions)

    // 將驗證碼存儲到記憶體中（實際應用建議使用Redis）
    global.verificationCodes = global.verificationCodes || {}
    global.verificationCodes[email] = {
      code: verificationCode,
      timestamp: Date.now() + 30 * 60 * 1000 // 30分鐘後過期
    }

    return res.json({ 
      status: 'success', 
      message: '重設密碼驗證信已寄出，請至您的信箱查看',
      code: verificationCode // 開發時可回傳，正式環境要移除
    })
  } catch (error) {
    console.error('發送重設密碼郵件失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '發送郵件失敗' 
    })
  }
})

// 驗證重設密碼驗證碼路由
router.post('/validateResetCode', async (req, res) => {
  const { email, code } = req.body

  try {
    // 檢查驗證碼是否存在及是否過期
    if (!global.verificationCodes || !global.verificationCodes[email]) {
      return res.status(400).json({ 
        status: 'error', 
        message: '驗證碼不存在或已過期' 
      })
    }

    const storedData = global.verificationCodes[email]
    
    // 檢查是否過期
    if (Date.now() > storedData.timestamp) {
      delete global.verificationCodes[email]
      return res.status(400).json({ 
        status: 'error', 
        message: '驗證碼已過期' 
      })
    }

    // 檢查驗證碼是否正確
    if (storedData.code !== code) {
      return res.status(400).json({ 
        status: 'error', 
        message: '驗證碼錯誤' 
      })
    }

    // 驗證成功，標記為已驗證
    global.verificationCodes[email].verified = true

    return res.json({ 
      status: 'success', 
      message: '驗證成功' 
    })
  } catch (error) {
    console.error('驗證驗證碼失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '驗證失敗' 
    })
  }
})

// 重設密碼路由
router.post('/resetPassword', async (req, res) => {
  const { username, newPassword } = req.body

  try {
    // 檢查用戶是否存在
    const user = await sequelize.query(
      'SELECT * FROM member WHERE username = :username',
      {
        replacements: { username },
        type: QueryTypes.SELECT,
      }
    )

    if (user.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: '用戶不存在' 
      })
    }

    // 檢查驗證碼是否已驗證
    if (!global.verificationCodes || 
        !global.verificationCodes[username] || 
        !global.verificationCodes[username].verified) {
      return res.status(400).json({ 
        status: 'error', 
        message: '請先完成驗證碼驗證' 
      })
    }

    // 檢查新密碼是否與舊密碼相同
    if (user[0].password === newPassword) {
      return res.status(400).json({ 
        status: 'error', 
        message: '新密碼不能與舊密碼相同' 
      })
    }

    // 更新密碼
    await sequelize.query(
      'UPDATE member SET password = :newPassword WHERE username = :username',
      {
        replacements: { newPassword, username },
        type: QueryTypes.UPDATE,
      }
    )

    // 清除驗證碼記錄
    delete global.verificationCodes[username]

    return res.json({ 
      status: 'success', 
      message: '密碼重設成功' 
    })
  } catch (error) {
    console.error('重設密碼失敗:', error)
    return res.status(500).json({ 
      status: 'error', 
      message: '重設密碼失敗' 
    })
  }
})

export default router 