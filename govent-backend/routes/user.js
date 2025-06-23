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

    // 生成重設密碼的token (可自訂到期時間)
    const resetToken = jwt.sign(
      { userId: user[0].id, email: user[0].username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2h' } // 改為2小時，可根據需要調整
    )

    // 發送重設密碼郵件
    const resetUrl = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'Govent - 重設密碼請求',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
                     <title>Govent - 重設密碼</title>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <meta name="x-apple-disable-message-reformatting" />
          <style>
            * { text-size-adjust: 100%; -ms-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
            html { height: 100%; width: 100%; }
            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; mso-line-height-rule: exactly; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
            @media only screen and (max-width:600px) {
              .cBlock--spacingLR { padding-left: 16px !important; padding-right: 16px !important; }
            }
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
                           🔐 Govent 密碼重設請求
                         </h1>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Content -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left" width="100%" bgcolor="#121212" style="padding: 16px 32px;">
                        <p style="color:#ffffff; font-size:16px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 16px 0; line-height:1.6;">
                          親愛的會員您好，
                        </p>
                        <p style="color:#ffffff; font-size:16px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 24px 0; line-height:1.6;">
                          我們收到了您的密碼重設請求。請點擊下方按鈕來重設您的密碼：
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Button -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" width="100%" bgcolor="#121212" style="padding: 0px 32px 32px 32px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" bgcolor="#F16E0F" style="border-radius:6px;">
                              <a href="${resetUrl}" target="_blank" style="color:#ffffff; border-radius:6px; display:inline-block; text-decoration:none; font-size:16px; font-weight:bold; letter-spacing:1px; padding:12px 32px;">
                                <span style="color:#ffffff; text-decoration:none; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif;">
                                  重設我的密碼
                                </span>
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Footer Info -->
                  <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="left" width="100%" bgcolor="#121212" style="padding: 0px 32px 48px 32px;">
                        <p style="color:#cccccc; font-size:14px; font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif; padding:0; margin:0 0 12px 0; line-height:1.6;">
                          ⚠️ 此連結將在 <strong style="color:#F16E0F;">2小時後</strong> 過期。
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

export default router 