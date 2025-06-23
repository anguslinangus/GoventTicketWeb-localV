import express from 'express'
const router = express.Router()

import { createOtp, updatePassword } from '#db-helpers/otp.js'

import transporter from '#configs/mail.js'
import 'dotenv/config.js'

// 電子郵件 HTML 模板
const mailHTML = (otpToken) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
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
                      ${otpToken}
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

// 電子郵件文字訊息樣版 (保留作為備用)
const mailText = (otpToken) => `親愛的 Govent 會員您好，

通知重設密碼所需要的驗証碼，
請輸入以下的6位數字，重設密碼頁面的"電子郵件驗証碼"欄位中。
請注意驗証碼將於寄送後30分鐘後到期，如有任何問題請洽網站客服人員:
    
${otpToken}
    
敬上

Govent 客服團隊`

// create otp
router.post('/otp', async (req, res, next) => {
  const { email } = req.body

  if (!email) return res.json({ status: 'error', message: '缺少必要資料' })

  // 建立otp資料表記錄，成功回傳otp記錄物件，失敗為空物件{}
  const otp = await createOtp(email)

  // console.log(otp)

  if (!otp.token)
    return res.json({ status: 'error', message: 'Email錯誤或期間內重覆要求' })

  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人名稱，email在.env檔中代入
    from: `"support"<${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: '重設密碼要求的電子郵件驗証碼',
    html: mailHTML(otp.token),
  }

  // 寄送email
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      // console.log(err)
      return res.json({ status: 'error', message: '發送電子郵件失敗' })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
})

// 重設密碼用
router.post('/reset', async (req, res) => {
  const { email, token, password } = req.body

  if (!token || !email || !password) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // updatePassword中驗証otp的存在與合法性(是否有到期)
  const result = await updatePassword(email, token, password)

  if (!result) {
    return res.json({ status: 'error', message: '修改密碼失敗' })
  }

  // 成功
  return res.json({ status: 'success', data: null })
})

export default router
