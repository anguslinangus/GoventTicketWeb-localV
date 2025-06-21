// 使用環境變數而不是硬編碼 API Key
export const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

// 如果沒有設置環境變數，顯示警告
if (!apiKey && typeof window !== 'undefined') {
  console.warn('⚠️ Google Maps API Key 未設置。請在 .env.local 中設置 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
}