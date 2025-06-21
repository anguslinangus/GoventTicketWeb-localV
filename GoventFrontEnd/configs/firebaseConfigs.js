const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'govent-27663.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'govent-27663',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'govent-27663.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '312833573850',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:312833573850:web:be6206aa7d6bf4e90376e3',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DPVTSVHQRQ',
}

// 在開發環境中檢查環境變數是否設置
if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn('⚠️ Firebase API Key 未設置。請在 .env.local 中設置 NEXT_PUBLIC_FIREBASE_API_KEY')
}

export { firebaseConfig }
