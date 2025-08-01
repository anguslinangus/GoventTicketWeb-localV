import { useEffect } from 'react'

// 樣式
import '@/styles/globals.scss'
import '@/styles/product.scss'
import '@/styles/cart.scss'
import '@/styles/loader.scss'

// Toast 設置
import { Toaster } from 'react-hot-toast'

// 載入購物車context
import { CartProvider } from '@/hooks/use-cart'
// 載入認証用context
import { AuthProvider } from '@/hooks/use-auth'
import { GoogleAuthAuthProvider } from '@/hooks/firebase-google-auth'
// 載入動畫context
import { LoaderProvider } from '@/hooks/use-loader'

import DefaultLayout from '@/components/layout/default-layout'
// 自訂用載入動畫元件
import { CatLoader, NoLoader } from '@/hooks/use-loader/components'
// 載入Quill編輯器樣式
import 'react-quill/dist/quill.snow.css'

export default function MyApp({ Component, pageProps }) {
  // 導入bootstrap的JS函式庫
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  // 使用預設排版檔案，對應`components/layout/default-layout/index.js`
  // 或`components/layout/default-layout.js`
  const getLayout =
    Component.getLayout || ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <AuthProvider>
      <GoogleAuthAuthProvider>
        <LoaderProvider close={2} CustomLoader={CatLoader}>
          <CartProvider>
            {getLayout(<Component {...pageProps} />)}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                                      background: '#333',
                    color: '#fff',
                    fontSize: '1.2em',   // 字體放大 1.2 倍
                    padding: '16px 24px',  // 增加內邊距
                    minWidth: '300px',     // 最小寬度
                  borderRadius: '8px',   // 圓角
                },
              }}
            />
          </CartProvider>
        </LoaderProvider>
      </GoogleAuthAuthProvider>
    </AuthProvider>
  )
}