# Govent 專案部署檢查清單

## ✅ 部署前準備

### 1. 程式碼準備
- [ ] 清除所有 console.log (生產環境)
- [ ] 移除未使用的依賴
- [ ] 確認所有 API 端點正常運作
- [ ] 測試所有主要功能流程

### 2. 環境變數設定

#### 後端 (Render)
- [ ] DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- [ ] JWT_SECRET
- [ ] FRONTEND_URL (Vercel URL)
- [ ] FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
- [ ] GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- [ ] LINE_CHANNEL_ID, LINE_CHANNEL_SECRET
- [ ] ECPAY_MERCHANT_ID, ECPAY_HASH_KEY, ECPAY_HASH_IV
- [ ] NODE_ENV=production

#### 前端 (Vercel)
- [ ] NEXT_PUBLIC_API_URL (Render URL)
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

### 3. 資料庫設定
- [ ] 建立 PlanetScale 帳號
- [ ] 建立新資料庫
- [ ] 匯出本地資料庫
- [ ] 匯入到 PlanetScale
- [ ] 測試資料庫連線

## 🚀 部署步驟

### 1. 資料庫部署
- [ ] 註冊 PlanetScale
- [ ] 建立資料庫
- [ ] 取得連線字串
- [ ] 資料遷移

### 2. 後端部署 (Render)
- [ ] 推送程式碼到 GitHub
- [ ] 建立 Render Web Service
- [ ] 設定 GitHub 連接
- [ ] 配置環境變數
- [ ] 測試部署成功

### 3. 前端部署 (Vercel)
- [ ] 建立 Vercel 專案
- [ ] 連接 GitHub repository
- [ ] 設定 Root Directory 為 `GoventFrontEnd`
- [ ] 配置環境變數
- [ ] 測試部署成功

## 🔧 部署後測試

### 功能測試
- [ ] 使用者註冊/登入
- [ ] Google/Firebase 登入
- [ ] Line 登入
- [ ] 活動瀏覽
- [ ] 購票流程
- [ ] 付款功能 (測試模式)
- [ ] 會員中心
- [ ] 主辦方功能

### 技術測試
- [ ] API 回應時間 < 2 秒
- [ ] 前端頁面載入 < 3 秒
- [ ] 手機版本相容性
- [ ] SSL 憑證正常
- [ ] CORS 設定正確

## 🌍 域名與 DNS (可選)

如果要使用自訂域名：
- [ ] 購買域名
- [ ] 在 Vercel 設定自訂域名
- [ ] 在 Render 設定自訂域名
- [ ] 更新 CORS 設定
- [ ] 更新環境變數中的 URL

## 📊 監控設定

- [ ] 設定 Uptime 監控 (如 UptimeRobot)
- [ ] 啟用 Render 的 Health Check
- [ ] 設定錯誤通知
- [ ] 定期備份資料庫

## 💰 成本監控

- [ ] 監控 Vercel 使用量
- [ ] 監控 Render 使用時間
- [ ] 監控 PlanetScale 儲存量
- [ ] 設定使用量警告

## 🔐 安全檢查

- [ ] 確認所有環境變數已設定
- [ ] 檢查 API 端點安全性
- [ ] 確認 HTTPS 強制重導向
- [ ] 檢查 CORS 設定
- [ ] 確認資料庫連線加密

## 📝 文件更新

- [ ] 更新 README.md
- [ ] 記錄部署 URL
- [ ] 更新 API 文件
- [ ] 建立運維手冊 