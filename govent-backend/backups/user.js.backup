import express from 'express'
import sequelize from '#configs/db.js'
import { QueryTypes } from 'sequelize'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authenticate from '##/middlewares/authenticate.js'
import transporter from '#configs/mail.js'

dotenv.config()

// Create an express application
const app = express()

const router = express.Router()
const upload = multer()
app.use(express.json())

const corsOptions = {
  origin: 'http://govent.zeabur.app', // Adjust according to your frontend's origin
  credentials: true, // Allows cookies to be sent across origins
}

app.use(cors(corsOptions))

// Use cookieParser middleware
app.use(cookieParser())

//註冊路由
router.post('/signup', async function (req, res, next) {
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
  const userData = req.body
  console.log(userData)

  try {
    //檢查 email 是否被註冊過
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

    //調整地址跟時間到資料庫想要的格式
    const fullAddress = `${county}${township}${address}`
    const createTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const avatar = 'default_user.png'
    const point = 0

    //新增註冊者資料
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

//登入路由
router.post('/signin', upload.none(), async (req, res) => {
  const { username, password } = req.body

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

    if (user.length > 0) {
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
        secure: true, // use true in production with HTTPS
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })

      return res.status(200).json({ message: 'Login successful' })
    } else {
      return res.status(401).json({ message: 'Authentication failed' })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return res
      .status(500)
      .json({ message: 'An error occurred during authentication' })
  }
})

router.post('/googleSignIn', async (req, res) => {
  const { googleUser } = req.body
  console.log(googleUser)

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

      // Query the database again to get the user with the id
      user = await sequelize.query(
        'SELECT * FROM member WHERE username = :username',
        {
          replacements: { username: googleUser.email },
          type: QueryTypes.SELECT,
        }
      )
    } else {
      user = await sequelize.query(
        'SELECT * FROM member WHERE username = :username',
        {
          replacements: { username: googleUser.email },
          type: QueryTypes.SELECT,
        }
      )
    }

    const token = await jwt.sign(
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
      secure: true, // use true in production with HTTPS
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

router.get('/verifyToken', authenticate, (req, res) => {
  // If this point is reached, the `authenticate` middleware has already verified the token
  res.json({ message: 'User is authenticated', user: req.user })
})

router.get('/signout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: true, // use true in production with HTTPS
    sameSite: 'none',
  })
  res.json({ message: 'User has signed out', user: null })
})

//忘記密碼寄送email的路由
router.post('/forgetPasswordEmail', async (req, res) => {
  const { email } = req.body

  // 檢查是否有此 email
  const user = await sequelize.query(
    'SELECT * FROM member WHERE username = :username',
    {
      replacements: { username: email },
      type: QueryTypes.SELECT,
    }
  )
  if (user.length === 0) {
    return res
      .status(404)
      .json({ status: 'error', message: '此 email 尚未註冊成為會員' })
  }

  // 設定信件驗證碼格式
  const verificationCode = Math.floor(100000 + Math.random() * 900000)

  //將驗證碼存入資料庫
  const insertCode = await sequelize.query(
    'INSERT INTO resetpassword (username, resetPasswordCode) VALUES (:email, :verificationCode)',
    {
      replacements: { email, verificationCode },
      type: QueryTypes.INSERT,
    }
  )

  const mailOptions = {
    from: `<${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: 'Govent 忘記密碼驗證信',
    text: `你的重設密碼驗證碼是 ${verificationCode}`,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
      <head>
        <title></title>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <meta name="x-apple-disable-message-reformatting" />
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--<![endif]--><!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <style> * { text-size-adjust: 100%; -ms-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } html { height: 100%; width: 100%; } body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; mso-line-height-rule: exactly; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; } img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; } </style>
        <!--[if gte mso 9]>
        <style type="text/css"> li { text-indent: -1em; } table td { border-collapse: collapse; } </style>
        <![endif]-->
        <style> @media only screen and (max-width:600px) { .cBlock--spacingLR { padding-left: 16px !important; padding-right: 16px !important; } .img_block { width: 100% !important; } } </style>
      </head>
      <body class="body cLayout--bgColor" style="background-color:#121212; margin:0;width:100%;">
        <table class="layout__wrapper" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr class="layout__row">
            <td class="layout__column cLayout--bgColor" align="center" width="100%" style="padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px" bgcolor="#ffffff">
              <!--[if !mso]><!---->
              <div style="margin:0 auto;width:100%;max-width:640px;">
                <!-- <![endif]--><!--[if mso | IE]>
                <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="640" style="margin:0 auto;width:100%;max-width:640px;">
                  <tr>
                    <td>
                      <![endif]-->
                      <!-- Block: Start Text -->
                      <table class="block-inner" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="block-inner__content cBlock--spacingLR " align="left" valign="top" width="100%" bgcolor="#121212" style="padding-left:32px;padding-right:32px;padding-top:48px;padding-bottom:16px">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="left" >
                                  <h1 style="color:#ffffff;font-size:18px;font-weight:bold;font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif;padding:0;margin:0;line-height:1.4">
                                    Govent 重設密碼驗證信
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!-- Block: End Text -->
                      <!-- Block: Start Text -->
                      <table class="block-inner" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="block-inner__content cBlock--spacingLR " align="left" valign="top" width="100%" bgcolor="#121212" style="padding-left:32px;padding-right:32px;padding-top:16px;padding-bottom:16px">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="center" >
                                  <h3 style="color:#ffffff;font-size:18px;font-weight:bold;font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif;padding:0;margin:0;line-height:1.4">
                                  你的重設密碼驗證碼是 ${verificationCode}
                                  </h3>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!-- Block: End Text -->
                      <!-- Block: Start Button -->
                      <table class="block-inner" align="center" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="block-inner__content cBlock--spacingLR " align="left" valign="top" width="100%" bgcolor="#121212" style="padding-left:32px;padding-right:32px;padding-top:0px;padding-bottom:48px">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tbody>
                                <tr>
                                  <td align="center">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                      <tbody>
                                        <tr>
                                          <!--[if mso | IE]>
                                          <td align="center" bgcolor="#005da0" style="color:#ffffff;padding-top:7px;padding-bottom:7px;padding-left:60px;padding-right:60px">
                                            <![endif]--><!--[if !mso]><!---->
                                          <td align="center" bgcolor="#F16E0F" style="border-radius:4px">
                                            <!-- <![endif]--><a class="dnd-button" href="http://govent.zeabur.app" target="_blank" style="color:#ffffff;border-radius:4px;display:inline-block;text-decoration:none;font-size:16px;font-weight:bold;letter-spacing:1px;padding-top:7px;padding-bottom:7px;padding-left:60px;padding-right:60px"><span class="a__text" style="color:#ffffff;text-decoration:none;font-family:'PingFang TC','微軟正黑體','Microsoft JhengHei','Helvetica Neue',Helvetica,Arial,sans-serif">Govent 您的休閒好夥伴</span></a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <!-- Block: End Button -->
                      <!--[if mso | IE]>
                    </td>
                  </tr>
                </table>
                <![endif]--><!--[if !mso]><!---->
              </div>
              <!-- <![endif]-->
            </td>
          </tr>
        </table>
      </body>
    </html>`,
  }

  transporter.sendMail(mailOptions, (err, code) => {
    if (err) {
      // 失敗處理
      console.error('Email sent error:', err)
      return res.status(400).json({ message: '驗證碼寄送失敗' })
    } else {
      // 成功回覆的json
      return res.json({ message: '驗證碼成功寄出', code: verificationCode })
    }
  })
})

router.post('/validateResetCode', async (req, res) => {
  const { email, code } = req.body
  console.log(email, code)

  // 檢查是否有此 email
  const user = await sequelize.query(
    'SELECT * FROM resetpassword WHERE username = :username AND resetPasswordCode = :code',
    {
      replacements: { username: email, code },
      type: QueryTypes.SELECT,
    }
  )

  if (user.length === 0) {
    return res.status(404).json({ message: '驗證碼錯誤' })
  }

  return res.status(200).json({ message: '驗證碼正確', code })
})

router.post('/resetPassword', async (req, res) => {
  const { username, newPassword } = req.body
  console.log(username, newPassword)

  //先確認是否跟原本密碼一樣
  const passwordCheck = await sequelize.query(
    'SELECT * FROM member WHERE username =:username AND password = :password',
    {
      replacements: { username: username, password: newPassword },
      type: QueryTypes.SELECT,
    }
  )
  if (passwordCheck.length > 0) {
    return res.status(400).json({ message: '新密碼不能與舊密碼相同' })
  }
  //更新密碼
  await sequelize.query(
    'UPDATE member SET password = :password WHERE username = :username',
    {
      replacements: { username: username, password: newPassword },
      type: QueryTypes.UPDATE,
    }
  )
  return res.status(200).json({ message: '密碼已更新', newPassword })
})

export default router
