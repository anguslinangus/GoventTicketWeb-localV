# Railway 環境變數設定指南

## 🔧 分別設定服務

### 1. 後端服務環境變數 (govent-backend)

```env
# 資料庫設定 (Railway MySQL 自動提供)
DATABASE_URL=${{MySQL.DATABASE_URL}}
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# 應用程式設定
NODE_ENV=production
PORT=3001
JWT_SECRET_KEY=your-super-secret-jwt-key-here

# 前端 URL (等前端部署完成後設定)
FRONTEND_URL=${{govent-frontend.RAILWAY_PUBLIC_DOMAIN}}

# 第三方服務 - Firebase
FIREBASE_PROJECT_ID=govent-27663
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# OAuth 設定
ACCESS_TOKEN_SECRET=your-access-token-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Line 相關
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
LINE_LOGIN_CALLBACK_URL=https://your-backend.railway.app/api/line-login/callback
LINE_PAY_CHANNEL_ID=your-line-pay-channel-id
LINE_PAY_CHANNEL_SECRET=your-line-pay-channel-secret

# 郵件設定
SMTP_TO_EMAIL=your-email@gmail.com
SMTP_TO_PASSWORD=your-email-password
SMTP_FROM_EMAIL=your-email@gmail.com

# 其他
OTP_SECRET=your-otp-secret
SHIP_711_STORE_CALLBACK_URL=https://your-backend.railway.app/api/shipment/callback
REACT_REDIRECT_CONFIRM_URL=https://your-frontend.railway.app/payment/confirm
REACT_REDIRECT_CANCEL_URL=https://your-frontend.railway.app/payment/cancel
```

### 2. 前端服務環境變數 (govent-frontend)

```env
# API 端點 (等後端部署完成後設定)
NEXT_PUBLIC_API_URL=https://${{govent-backend.RAILWAY_PUBLIC_DOMAIN}}/api

# Firebase 設定
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=govent-27663.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=govent-27663
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=govent-27663.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=312833573850
NEXT_PUBLIC_FIREBASE_APP_ID=1:312833573850:web:be6206aa7d6bf4e90376e3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DPVTSVHQRQ

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# 應用程式資訊
NEXT_PUBLIC_APP_NAME=Govent
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🚀 部署順序

1. **MySQL 資料庫** (先建立)
2. **後端服務** (govent-backend)
3. **前端服務** (govent-frontend)
4. **設定跨服務環境變數**

## 📝 重要注意事項

### Railway 特殊語法
- `${{MySQL.DATABASE_URL}}` - 引用 MySQL 服務的連線 URL
- `${{govent-backend.RAILWAY_PUBLIC_DOMAIN}}` - 引用後端服務的域名
- `${{govent-frontend.RAILWAY_PUBLIC_DOMAIN}}` - 引用前端服務的域名

### 設定步驟
1. 每個服務都要單獨設定環境變數
2. 使用 Railway 的服務引用語法
3. 先部署資料庫和後端，再設定前端的 API URL
4. 完成後端部署後，更新前端的環境變數

### 需要取得的金鑰
- JWT_SECRET_KEY: 隨機生成的長字串
- Firebase 相關金鑰: 從 Firebase Console 取得
- Google OAuth: 從 Google Cloud Console 取得  
- Line 相關: 從 Line Developers Console 取得
- Google Maps API: 從 Google Cloud Console 取得 