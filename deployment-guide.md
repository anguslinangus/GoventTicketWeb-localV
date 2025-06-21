# Govent 專案部署指南

## 部署架構
- **前端**: Vercel (Next.js)
- **後端**: Render (Node.js + Express)
- **資料庫**: PlanetScale (MySQL)

## 部署前準備

### 1. 環境變數整理
將以下環境變數分別設定到對應平台：

#### 後端環境變數 (Render)
```env
# 資料庫
DB_HOST=your-planetscale-host
DB_PORT=3306
DB_DATABASE=your-database-name
DB_USERNAME=your-username
DB_PASSWORD=your-password

# JWT 密鑰
JWT_SECRET=your-jwt-secret

# 第三方服務
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret

# 金流設定
ECPAY_MERCHANT_ID=your-ecpay-merchant-id
ECPAY_HASH_KEY=your-ecpay-hash-key
ECPAY_HASH_IV=your-ecpay-hash-iv

# CORS 設定
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### 前端環境變數 (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
```

## 部署步驟

### 1. 資料庫部署 (PlanetScale)

1. 註冊 [PlanetScale](https://planetscale.com/) 帳號
2. 建立新資料庫
3. 取得連線資訊
4. 匯出現有 MySQL 資料並匯入到 PlanetScale

### 2. 後端部署 (Render)

1. 推送程式碼到 GitHub
2. 在 Render 建立新的 Web Service
3. 連接 GitHub repository，選擇 `govent-backend` 資料夾
4. 設定環境變數
5. 自動部署

### 3. 前端部署 (Vercel)

1. 在 Vercel 建立新專案
2. 連接 GitHub repository，選擇 `GoventFrontEnd` 資料夾
3. 設定環境變數
4. 自動部署

## 部署配置文件

### render.yaml (後端)
```yaml
services:
  - type: web
    name: govent-backend
    env: node
    plan: free
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

### vercel.json (前端)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.mjs",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

## 注意事項

1. **CORS 設定**: 確保後端 CORS 包含 Vercel 域名
2. **資料庫連線**: PlanetScale 使用 SSL 連線
3. **環境變數**: 敏感資訊不要提交到 Git
4. **檔案上傳**: 如需檔案上傳功能，考慮使用 Cloudinary 或 AWS S3
5. **SSL 憑證**: Render 和 Vercel 都自動提供 HTTPS

## 替代方案

如果預算允許，也可考慮：
- **Railway**: 可同時部署前後端和資料庫
- **Heroku**: 經典選擇，但付費方案
- **DigitalOcean App Platform**: 全方位解決方案

## 成本估算

- **免費方案**: 
  - Vercel: 免費 (個人使用)
  - Render: 免費 750小時/月
  - PlanetScale: 免費 5GB

- **付費升級**: 
  - Vercel Pro: $20/月
  - Render: $7/月起
  - PlanetScale: $29/月起

## 監控與維護

1. 設定 Uptime 監控
2. 定期備份資料庫
3. 監控 API 回應時間
4. 設定錯誤日誌收集 