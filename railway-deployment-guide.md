# Govent 專案 Railway 部署指南

## 🚀 部署架構 (Railway 全套)
- **前端**: Railway (Next.js)
- **後端**: Railway (Node.js + Express)
- **資料庫**: Railway (MySQL)
- **優點**: 一站式解決方案，成本低，管理簡單

## 💰 成本估算
- **免費額度**: $5 credit/月
- **付費後**: 約 $10-20/月 (根據使用量)
- **比 Vercel + Render + PlanetScale 便宜很多**

## 🔧 部署步驟

### 1. 註冊 Railway
1. 前往 https://railway.app
2. 用 GitHub 帳號登入
3. 連接你的 GitHub repository

### 2. 建立專案
1. 點擊 "New Project"
2. 選擇 "Deploy from GitHub repo"
3. 選擇你的 `GoventTicketWeb` repository

### 3. 設定服務
Railway 會自動偵測到兩個服務：
- **Frontend**: `GoventFrontEnd` 資料夾 (Next.js)
- **Backend**: `govent-backend` 資料夾 (Node.js)

### 4. 建立 MySQL 資料庫
1. 在 Railway 專案中點擊 "Add Service"
2. 選擇 "Database" > "MySQL"
3. Railway 會自動建立 MySQL 實例

### 5. 匯入現有資料庫
1. 在 MySQL 服務中點擊 "Connect"
2. 取得連線資訊
3. 使用 MySQL Workbench 或命令列工具匯入 `big_govent.sql`

### 6. 設定環境變數

#### 後端環境變數
```env
# 資料庫 (Railway 會自動提供)
MYSQL_URL=mysql://user:password@host:port/database

# 或分別設定
DB_HOST=railway-mysql-host
DB_PORT=3306
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=railway-generated-password

# 其他環境變數
NODE_ENV=production
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-frontend.railway.app

# 第三方服務
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINE_CHANNEL_ID=your-line-channel-id
LINE_CHANNEL_SECRET=your-line-channel-secret
ECPAY_MERCHANT_ID=your-ecpay-merchant-id
ECPAY_HASH_KEY=your-ecpay-hash-key
ECPAY_HASH_IV=your-ecpay-hash-iv
```

#### 前端環境變數
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🎯 部署流程

### Step 1: 準備 Railway 配置文件
- 前端：`railway.toml` (Next.js)
- 後端：`railway.toml` (Node.js)

### Step 2: 建立 Railway 專案
- 連接 GitHub repository
- 自動偵測服務

### Step 3: 配置服務
- 設定 Root Directory
- 配置 Build 和 Start 命令

### Step 4: 部署
- 自動從 GitHub 部署
- 監控部署日誌

## 🔄 自動部署
每次推送到 main 分支時，Railway 會自動重新部署。

## 📊 監控
Railway 提供內建的監控功能：
- CPU 使用率
- 記憶體使用量
- 網路流量
- 應用程式日誌

## 🔐 安全性
- 自動 HTTPS
- 環境變數加密
- 私有網路連接 