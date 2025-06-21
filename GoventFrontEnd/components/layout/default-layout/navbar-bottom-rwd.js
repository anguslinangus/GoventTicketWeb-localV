import React, { useState } from 'react'

export default function NavbarBottomRwd() {
  const [activeButton, setActiveButton] = useState(0)
  const handleClick = (buttonIndex) => {
    setActiveButton(buttonIndex)
  }

  return (
    <>
      <div className="bg-normal-gray-deep container d-block d-xxl-none fixed-bottom">
        <div className="row">
          <button
            className={`col-3 btn ${
              activeButton === 0
                ? 'text-primary-deep'
                : 'text-normal-gray-light'
            } text-center`}
            onClick={() => handleClick(0)}
          >
            <i class="bi bi-house fs-1"></i>
            <div className="sm-p">首頁</div>
          </button>
          <button
            className={`col-3 btn ${
              activeButton === 1
                ? 'text-primary-deep'
                : 'text-normal-gray-light'
            } text-center`}
            onClick={() => handleClick(1)}
          >
            <i class="bi bi-star fs-1"></i>
            <div className="sm-p">我的收藏</div>
          </button>
          <button
            className={`col-3 btn ${
              activeButton === 2
                ? 'text-primary-deep'
                : 'text-normal-gray-light'
            } text-center`}
            onClick={() => handleClick(2)}
          >
            <i class="bi bi-ticket-perforated fs-1"></i>
            <div className="sm-p">我的票券</div>
          </button>
          <button
            className={`col-3 btn ${
              activeButton === 3
                ? 'text-primary-deep'
                : 'text-normal-gray-light'
            } text-center`}
            onClick={() => handleClick(3)}
          >
            <i class="bi bi-person fs-1"></i>
            <div className="sm-p">帳戶設定</div>
          </button>
        </div>
      </div>
    </>
  )
}
