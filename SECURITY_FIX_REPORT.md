# 🚨 安全修復報告 - API Key 洩露問題

## 執行時間
2024年12月20日

## 問題描述

GitHub 安全掃描檢測到專案中存在多個 Google API Key 洩露問題，這些敏感信息被硬編碼在源代碼中，可能導致：

1. **API 配額濫用** - 他人可能使用洩露的 API Key 進行大量請求
2. **服務費用損失** - 可能產生意外的 Google Cloud 費用
3. **服務中斷風險** - API Key 可能被 Google 停用
4. **數據安全風險** - 可能被用於未授權的數據訪問

## 受影響的文件

### 🔴 高風險文件（已修復）
- `GoventFrontEnd/configs/googleApi.js` - Google Maps API Key
- `GoventFrontEnd/configs/firebaseConfigs.js` - Firebase 配置
- `GoventFrontEnd/hooks/use-firebase.js` - Firebase 配置重複

### 🟡 中風險文件（已刪除）
- `govent-backend/data/firebase-google/redirect-user-sample.json` - 包含真實 API Key
- `govent-backend/data/firebase-google/return-user-sample.json` - 包含真實 API Key  
- `govent-backend/data/firebase-facebook/return-user-sample.json` - 包含真實 API Key

### 🟠 低風險文件（備份文件，建議定期清理）
- `govent-backend/backups/user-consolidated.js`
- `govent-backend/backups/user.js.backup`
- `govent-backend/backups/routes/user.js.backup`

## 修復措施

### 1. ✅ 配置文件環境變數化
將所有硬編碼的 API Key 替換為環境變數：

```javascript
// 修復前
export const apiKey = 'AIzaSyAHFrjbu51UUJwGpirJ1l6vhsfT6LbFcrY'

// 修復後
export const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
```

### 2. ✅ 刪除敏感示例文件
刪除了包含真實 API Key 的示例數據文件

### 3. ✅ 添加環境變數檢查
在配置文件中添加開發環境警告：

```javascript
if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn('⚠️ Firebase API Key 未設置。請在 .env.local 中設置 NEXT_PUBLIC_FIREBASE_API_KEY')
}
```

## 🚨 立即需要執行的安全措施

### 1. 撤銷並重新生成 API Key
**必須立即執行以下步驟：**

1. **Google Maps API Key:**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - 撤銷洩露的 API Key: `AIzaSyAHFrjbu51UUJwGpirJ1l6vhsfT6LbFcrY`
   - 生成新的 API Key 並設置適當的限制

2. **Firebase API Key:**
   - 前往 [Firebase Console](https://console.firebase.google.com/)
   - 撤銷洩露的 API Key: `AIzaSyBhIe5T0VSZ_PBLNRhNQmVG4aGheLejKyI`
   - 重新生成 Firebase 配置

### 2. 設置環境變數
創建 `GoventFrontEnd/.env.local` 文件：

```bash
# Google API Keys
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_new_google_maps_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_new_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=govent-27663.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=govent-27663
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=govent-27663.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=312833573850
NEXT_PUBLIC_FIREBASE_APP_ID=1:312833573850:web:be6206aa7d6bf4e90376e3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-DPVTSVHQRQ
```

### 3. API Key 安全設置
為新的 API Key 設置以下限制：

**Google Maps API Key:**
- 設置 HTTP referrer 限制
- 只允許必要的 API（Maps JavaScript API）
- 設置每日配額限制

**Firebase API Key:**
- 設置 Firebase 安全規則
- 限制允許的域名
- 啟用 App Check（如果適用）

## 驗證修復

### 1. 檢查代碼中是否還有硬編碼的 API Key
```bash
# 在專案根目錄執行
grep -r "AIza" . --exclude-dir=node_modules --exclude-dir=.git
```

### 2. 確認環境變數正常工作
- 啟動開發服務器
- 檢查控制台是否有 API Key 警告
- 測試 Google Maps 和 Firebase 功能

### 3. 確認 .gitignore 規則
確保 `.env.local` 文件不會被提交到版本控制：
```bash
git status  # 確認 .env.local 不在待提交列表中
```

## 長期安全建議

1. **定期安全審計** - 每季度檢查是否有新的敏感信息洩露
2. **使用 Git hooks** - 設置 pre-commit hook 檢測敏感信息
3. **員工培訓** - 確保團隊了解不要將敏感信息提交到版本控制
4. **使用密鑰管理服務** - 考慮使用 AWS Secrets Manager 或 Azure Key Vault
5. **啟用 GitHub 安全功能** - 確保 Secret scanning 和 Dependabot 啟用

## 影響評估

- **修復時間**: 約 30 分鐘
- **服務中斷**: 無（如果正確設置環境變數）
- **功能影響**: 無（保持原有功能）
- **安全提升**: 顯著提升，消除 API Key 洩露風險

## 狀態

- ✅ 代碼修復完成
- ✅ 敏感文件已刪除
- ⚠️ **待執行**: 撤銷並重新生成 API Key
- ⚠️ **待執行**: 設置環境變數文件
- ⚠️ **待執行**: 測試功能正常運作

---

**重要提醒**: 這個修復只是第一步，撤銷洩露的 API Key 是最關鍵的安全措施，必須立即執行！ 