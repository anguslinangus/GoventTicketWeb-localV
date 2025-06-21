import { useState, useEffect } from 'react'

export default function PageBar(currentPage, totalItems, itemsPerPage, paginate) {
  //設定頁碼
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    // <div className="btn-group " role="group" aria-label="group">
    //   <button
    //     type="button"
    //     className="btn btn-normal-gray"
    //     aria-label="previous"
    //   >
    //     &laquo;
    //   </button>
    //   <button type="button" className="btn btn-primary">
    //     1
    //   </button>
    //   <button type="button" className="btn btn-secondary text-white">
    //     2
    //   </button>
    //   <button type="button" className="btn btn-secondary">
    //     3
    //   </button>
    //   <button type="button" className="btn btn-secondary">
    //     4
    //   </button>
    //   <button type="button" className="btn btn-secondary">
    //     5
    //   </button>
    //   <button type="button" className="btn btn-secondary">
    //     6
    //   </button>
    //   <button type="button" className="btn btn-normal-gray" aria-label="next">
    //     &raquo;
    //   </button>
    // </div>
    <div className="btn-group" role="group" aria-label="group">
    {/* 上一頁 */}
    <button
      type="button"
      className="btn btn-normal-gray"
      aria-label="previous"
      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
    >
      &laquo;
    </button>
    {/* 依照資料數量調整頁碼 */}
    {pageNumbers.map(number => (
      <button
        key={number}
        type="button"
        onClick={() => paginate(number)}
        className={`btn ${number === currentPage ? 'btn-primary' : 'btn-secondary text-white'}`}
      >
        {number}
      </button>
    ))}
    {/* 下一頁 */}
    <button
      type="button"
      className="btn btn-normal-gray"
      aria-label="next"
      onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
    >
      &raquo;
    </button>
  </div>
  )
}
