import React from 'react'
import Link from 'next/link'

export default function OrganizerTopBar({ title = '' }) {
  return (
    <div className="px-4 py-3 d-flex justify-content-between mb-2">
      <h4 className="m-0">{title}</h4>
      <div>
        <Link href="/">
          <button className="btn btn-outline-primary">
            <i className="bi bi-caret-left-fill pe-2"></i>回首頁
          </button>
        </Link>
      </div>
    </div>
  )
}
