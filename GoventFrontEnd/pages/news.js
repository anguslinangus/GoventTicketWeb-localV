import React from 'react'
import NoBCLayout from '@/components/layout/nobc-layout'
export default function News() {
  return <div>News</div>
}
News.getLayout = function (page) {
  return <NoBCLayout>{page}</NoBCLayout>
}
