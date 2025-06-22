import Image from 'next/image'
import Link from 'next/link'

// 組合以下區塊
import Toolbar from './toolbar'
import ToturialPanel from './tutorial-panel'

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { motion } from 'framer-motion'

const MyNavbar = () => {
  // currentRoute是用來套用active樣式(目前區域對應選單項目)，需傳入MainMenu中
  const router = useRouter()
  const currentRoute = router.pathname

  // 控制Off
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [scrolled, setScrolled] = useState(false)

  const handleScroll = () => {
    // 監聽滾動事件，並根據捲動位置更新狀態
    if (window.scrollY > 0) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  useEffect(() => {
    // 添加滾動事件監聽
    window.addEventListener('scroll', handleScroll)

    // 清理工作
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // 空依賴數組表示僅在組件挂載和卸載時執行

  return (
    <>
      <header>
        <nav
          data-bs-theme="dark"
          className={`navbar navbar-expand-lg fixed-top navbar-light py-3`}
        >
          <div className={`bg-change ${scrolled ? 'scrolled' : ''}`}></div>
          <div className="container width-1200">
            <Link className="navbar-brand ps-4 d-flex align-items-center" href="/">
              <Image
                src="/govent-logo.png"
                alt=""
                width={100}
                height={24}
                priority
              />
              <h6 className='ms-2 mb-1'>會員中心</h6>
            </Link>
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="offcanvas-body"
              >
                <Toolbar currentRoute={currentRoute} handleShow={handleShow} />
              </motion.div>
            </div>
          </div>
        </nav>
        <ToturialPanel show={show} handleClose={handleClose} />
      </header>
      {/* hover動畫(下底線)，需要覆蓋原本global.scss樣式 */}
      <style global jsx>{`
        @media screen and (min-width: 992px) {
          .navbar {
            padding: 0;
          }
          .navbar .navbar-nav .nav-link {
            padding: 1em 0;
          }
          .navbar .navbar-nav .nav-item {
            margin: 0 1em;
          }
        }

        .nav-link{
          color: white;
        }

        .navbar .navbar-nav .nav-item {
          position: relative;
        }
        .bg-change {
          position: absolute;
          background: linear-gradient(
            180deg,
            rgba(21, 21, 21, 99),
            rgba(21, 21, 21, 0)
          );
          transition: all 0.5s;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0;
        }
        .bg-change.scrolled {
          opacity: 1;
        }

        .navbar .navbar-nav .nav-item::after {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
          content: '';
          background-color: black;
          width: 0%;
          height: 2px;
          transition: all 0.5s;
        }
        .navbar .navbar-nav .nav-item:hover::after {
          width: 100%;
        }
        .dropdown-menu{
          background-color: #1a1a1a60;
          backdrop-filter: blur(10px);
          
          li a{
            color: white;
            transition: 300ms;
            &:hover{
              background-color: var(--primary-50-color);
            }
        }
      `}</style>
    </>
  )
}

export default MyNavbar
