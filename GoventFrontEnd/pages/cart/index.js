import React from 'react'
import dynamic from 'next/dynamic'
const CartIndex = dynamic(() => import('@/components/cart/index'), {
  ssr: false,
})

export default function CartIndexPage() {
  return (
    <>
      <CartIndex />
    </>
  )
}
