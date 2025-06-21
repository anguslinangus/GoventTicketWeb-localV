import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import NoCart from '@/components/cart/no-cart'
import EventsRecommend from '@/components/events-recommend'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Modal } from 'react-bootstrap'
const TodoAll = dynamic(() => import('@/components/cart/todo-all'), {
  ssr: false,
})
const CartCard = dynamic(() => import('@/components/cart/cart-card'), {
  ssr: false,
})
//勾子
import { useCart } from '@/hooks/use-cart'

export default function CartIndex() {
  //--------
  //引入勾子
  const {
    cartItems,
    setCartItems,
    removeItem,
    calcTotalItemstotal,
    calcTotalPricetotal,
    foundMt,
    incrementOne,
    decrementOne,
    handleToggleSelectedAll,
    newtoggleCheckbox,
    MerchantIds,
  } = useCart()
  const [hasMtItems, setHasMtItems] = useState(false)

  useEffect(() => {
    const mtItems = window.localStorage.getItem('cartItems')
    const newsMtItems = JSON.parse(mtItems).length
    // console.log(newsMtItems)
    if (newsMtItems > 0) {
      setHasMtItems(true)
    } else {
      setHasMtItems(false)
    }
  }, [])
  const [showModal, setShowModal] = useState(false)
  // console.log(showModal)

  const checkAllChecked = (cartItems) => {
    let allUnchecked = true

    cartItems.forEach((Items) => {
      Items.items.forEach((item) => {
        if (item.checked) {
          allUnchecked = false
          return // 如果有一个选中了就跳出循环
        }
      })
    })

    setShowModal(allUnchecked) // 如果所有选项都未选中，则显示模态框
    return !allUnchecked // 返回是否有任何选项被选中
  }
  return (
    <>
      <div className="container width-1200">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className=""
        >
          <div className="cart-area card bg-bg-gray-secondary">
            <div className="border-0 cart-card border-bottom border-normal-gray">
              <Row className="my-4">
                <Col className="text-white d-flex align-items-center">
                  <Link href="/cart/event-list">
                    <h4 className="ms-4 text-white">購物車</h4>
                  </Link>
                </Col>
                <TodoAll
                  handleToggleSelectedAll={handleToggleSelectedAll}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                />
              </Row>
            </div>
            {/* 到時候return資料用這一層 */}
            {/* 沒購物車內容 判斷*/}
            {cartItems && cartItems.length > 0 ? (
              <CartCard
                foundMt={foundMt}
                removeItem={removeItem}
                calcTotalItemstotal={calcTotalItemstotal}
                calcTotalPricetotal={calcTotalPricetotal}
                incrementOne={incrementOne}
                decrementOne={decrementOne}
                handleToggleSelectedAll={handleToggleSelectedAll}
                cartItems={cartItems}
                MerchantIds={MerchantIds}
                setCartItems={setCartItems}
                newtoggleCheckbox={newtoggleCheckbox}
              />
            ) : (
              <NoCart />
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className=""
      >
        <EventsRecommend />
      </motion.div>

      {/* <NavbarBottomRwd /> */}
      <div className="border-0 cart-card d-block d-sm-none border-top border-normal-gray bg-normal-gray-deep fixed-bottom">
        {cartItems && cartItems.length > 0 ? (
          <div className="d-flex justify-content-between align-items-center m-2">
            <p className="text-primary-light ms-3">
              合計{calcTotalItemstotal}件商品
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <p className="text-white ms-3">總金額 NT {calcTotalPricetotal}</p>
              <h6 className="btn btn-primary-deep text-white ms-4 m-0">
                <Link
                  href="/payment"
                  className="text-white"
                  onClick={(e) => {
                    if (!checkAllChecked(cartItems)) {
                      e.preventDefault() // 阻止默认行为
                    }
                  }}
                >
                  前往結帳
                </Link>
              </h6>
            </div>
          </div>
        ) : (
          <div className="container d-flex justify-content-center bg-primary-deep">
            <Link href="/product/list" className="text-white my-2">
              瀏覽最新活動!
            </Link>
          </div>
        )}
      </div>
      {/* 吐司 */}
      <Modal
        show={showModal} // 控制模态框显示
        onHide={() => setShowModal(false)} // 点击模态框外部或关闭按钮时关闭模态框
        centered
      >
        <Modal.Body>
          <Modal.Header closeButton>請勾選要結帳的票券</Modal.Header>
        </Modal.Body>
      </Modal>
      <style global jsx>
        {`
          .myToast {
            /* Styles for the toast */
            background-color: #232323 !important;
            color: #c55708 !important;
          }
          body {
            background-color: #151515;
          }
          main > .container {
            padding: 60px 15px 0;
            max-width: 1200px;
            margin: 0 auto;
          }
          .card-cover {
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
          }

          .width-1200 {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0;
          }
          .event {
            transition: transform 0.3s ease;
          }
          .event:hover {
            transform: translateY(-5px);
            background-color: #151515;
          }
          .cart-logo {
            width: 160px;
          }

          @media screen and (max-width: 576px) {
            .truncatetext {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .card-body {
               {
                /* padding-bottom: 0; */
              }
            }
            .desktop-text {
              display: none;
            }
            .rwd-text {
              h6 {
                font-size: 14px;
                font-weight: 400;
                margin-bottom: 0;
              }
              p {
                font-size: 12px;
                font-weight: 300;
              }
              .hide {
                display: none;
              }
            }
          }
        `}
      </style>
    </>
  )
}
