import Head from 'next/head'
import { useLoader } from '@/hooks/use-loader'

export default function LoadingLayout({ title = '', children }) {
  const { loader } = useLoader()

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      
      <main className="flex-shrink-0">
          {children}
      </main>
      
    </>
  )
}
