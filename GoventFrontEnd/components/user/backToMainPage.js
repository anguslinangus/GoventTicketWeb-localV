import React from 'react'
import Link from 'next/link'

export default function BackToMainPage() {
  return (
    <>
      <div className="text-black mb-3 backToMainPage">
        <Link href="/" className="text-black">
          <i className="bi bi-caret-left-fill"></i>回首頁
        </Link>
      </div>
      <style jsx>
        {`
          .backToMainPage {
            @media screen and (max-width: 435px) {
              display: none;
            }
          }
        `}
      </style>
    </>
  )
}
