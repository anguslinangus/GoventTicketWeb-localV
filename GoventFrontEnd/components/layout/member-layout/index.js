// import MyNavbar from './my-navbar-nouse'
import MyNavbarBS5 from './my-navbar'
import MyFooter from './my-footer'
import Head from 'next/head'
import { useLoader } from '@/hooks/use-loader'

export default function MemberLayout({ title = '', children }) {
  const { loader } = useLoader()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <MyNavbarBS5 />
      <main className="flex-shrink-0">
        <div>
          {children}
        </div>
        {/* 全域的載入動畫指示器 */}
        {loader()}
      </main>
      <MyFooter />
    </>
  )
}
